# Simple AppSync Events Chat Example

## Add environment variables

- Note that the event endpoints will be the `Http endpoint` we receive from AWS Console + `/event`

```ts
Amplify.configure({
  API: {
    Events: {
      endpoint: `https://wbdmtogz7nf33csbnklxpggt24.appsync-api.us-west-2.amazonaws.com/event`,
      region: "us-west-2",
      defaultAuthMode: "apiKey",
      apiKey: "da2-****************************",
    },
  },
});
```

- We create a namespace called `chat`, so for each user private channer, it can be `chat/<userId>`

## Authentication with custom business logic

- Use `Lambda Authorizer`. [Read this instruction](https://aws.amazon.com/blogs/mobile/appsync-lambda-auth/)
- Pass the Cookies or JWT token received from backend to connect method belows

```ts
channel = await events.connect(`chat${chatRoom}`, { authToken: "SomeToken" });
// channel = await events.connect(`chat${chatRoom}`, { authMode: "userpool" });
channel.subscribe(
  {
    next: (data: Event) => {
      setMessages((prev) => [...prev, data]);
    },
    error: (err) => console.error("error", err),
  }
  // { authToken: "CUSTOM Auth Token for Lambda Authrorizer for custom business logic" },
  // { authMode: "userPool" }
);
```

## Request for Cognito JWT token from Backend

- Use `AdminInitiateAuth` flow to request a user cognito token
