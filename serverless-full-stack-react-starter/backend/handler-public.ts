import serverlessExpress from '@codegenie/serverless-express';
import { APIGatewayProxyHandler } from 'aws-lambda';
import app from './apps/public';

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
  console.log(event);
  return serverlessExpress({ app })(event, context, callback);
};
