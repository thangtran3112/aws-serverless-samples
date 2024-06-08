// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ConnectionTableName = process.env.CONNECTION_TABLE_NAME!;

export const getAllConnectionIds = async (): Promise<string[]> => {
  const input = {
    ExpressionAttributeNames: {
      "#ConnectionId": "connectionId",
      "#UserId": "userId",
    },
    ProjectionExpression: "#ConnectionId, #UserId",
    TableName: ConnectionTableName,
  };
  const command = new ScanCommand(input);
  const response = await client.send(command);
  if (!response || !response.Items) return [];
  const jsonItems = response.Items.map((i) => unmarshall(i));
  console.log(`Get all Connection Ids: ${JSON.stringify(jsonItems)}`);
  // [{ connectionId: 'id1', userId: 'userId1' }, { connectionId: 'id2', userId: 'userId2' }]
  return jsonItems.map((item) => item.connectionId) as string[];
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event);
  const routeKey = event.requestContext.routeKey!;
  const connectionId = event.requestContext.connectionId!;

  if (routeKey == "$connect") {
    const userId = event.requestContext.authorizer!.userId;

    try {
      await client.send(
        new PutCommand({
          TableName: ConnectionTableName,
          Item: {
            userId: userId,
            connectionId: connectionId,
            removedAt: Math.ceil(Date.now() / 1000) + 3600 * 3,
          },
        }),
      );
      return { statusCode: 200, body: "Connected." };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, body: "Connection failed." };
    }
  }
  if (routeKey == "$disconnect") {
    try {
      await removeConnectionId(connectionId);
      return { statusCode: 200, body: "Disconnected." };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, body: "Disconnection failed." };
    }
  }

  // Just echo back messages in other route than connect, disconnect (for testing purpose)
  const domainName = event.requestContext.domainName!;
  // When we use a custom domain, we don't need to append a stage name
  const endpoint = domainName.endsWith("amazonaws.com")
    ? `https://${event.requestContext.domainName}/${event.requestContext.stage}`
    : `https://${event.requestContext.domainName}`;
  const managementApi = new ApiGatewayManagementApiClient({
    endpoint,
  });
  const allConnectionIds = await getAllConnectionIds();
  //some connections may have been disconnected in the meantime, there could be GoneException
  for (const conId of allConnectionIds) {
    if (conId != connectionId) await postMessage(managementApi, conId, event.body!);
  }

  return { statusCode: 200, body: "Received." };
};

/**
 * This experiment succeeds in sending message to multiple subscribers
 * But it needs further refinement to avoid sending duplicate messages to the same subscriber
 * @TODO In order to avoid duplicate messages, we need check the origin connectionId of each message
 */
const postMessage = async (managementApi: ApiGatewayManagementApiClient, connectionId: string, message: string) => {
  try {
    await managementApi.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: Buffer.from(JSON.stringify({ message: message }), "utf-8"),
      }),
    );
  } catch (e: any) {
    if (e.statusCode == 410 || e.$metadata?.httpStatusCode == 410 || e.name === "GoneException") {
      await removeConnectionId(connectionId);
    } else {
      console.log(e);
      throw e;
    }
  }
};

const removeConnectionId = async (connectionId: string) => {
  return await client.send(
    new DeleteCommand({
      TableName: ConnectionTableName,
      Key: {
        connectionId,
      },
    }),
  );
};
