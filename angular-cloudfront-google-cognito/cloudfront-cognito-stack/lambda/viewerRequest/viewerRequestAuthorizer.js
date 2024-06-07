const { Authenticator } = require("cognito-at-edge");
const secretsManager = require("./secretsManager.js");

const secrets = await secretsManager.getSecrets();
const userPoolId = secrets.UserPoolID;
const clientId = secrets.ClientID;
const domainName = secrets.DomainName;

const authenticator = new Authenticator({
  // Replace these parameter values with those of your own environment
  region: "us-east-1", // user pool region
  loglevel: "info",
  userPoolId, // user pool ID
  userPoolAppId: clientId, // user pool app client ID
  userPoolDomain: `${domainName}.auth.us-east-1.amazoncognito.com`, // "domain.auth.us-east-1.amazoncognito.com", // user pool domain
});

exports.handler = async function (event) {
  const cf = event.Records[0].cf;

  if (cf.request.uri.startsWith("/index.html")) {
    return authenticator.handle(event);
  }

  // do nothing: CloudFront continues as usual
  return cf.request;
};
