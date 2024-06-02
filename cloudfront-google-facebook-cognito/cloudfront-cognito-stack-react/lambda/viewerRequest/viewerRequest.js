const cookie = require("cookie");
const jose = require("jose");
const secretsManager = require("./secretsManager.js");
const axios = require("axios");

async function verifyToken(cf, client_id, userPoolId) {
  console.log(`Client ID: ${client_id} User Pool ID: ${userPoolId}`);
  console.log(`Cookies: ${JSON.stringify(cf.request.headers?.cookie)}`);
  if (cf.request.headers.cookie) {
    const cookies = cookie.parse(cf.request.headers.cookie[0].value);
    const jwksRes = await axios.get(
      `https://cognito-idp.us-east-1.amazonaws.com/${userPoolId}/.well-known/jwks.json`
    );

    const jwk = jose.createLocalJWKSet(jwksRes.data);
    try {
      const { payload } = await jose.jwtVerify(cookies.token, jwk, {
        issuer: `https://cognito-idp.us-east-1.amazonaws.com/${userPoolId}`,
      });
      if (payload.client_id === client_id) {
        return true;
      }
    } catch (err) {
      console.log(`token error: ${err.name} ${err.message}`);
    }
  }
  return false;
}

exports.handler = async function (event) {
  console.log(`Cloudfront event: ${JSON.stringify(event)}`);
  const cf = event.Records[0].cf;
  const secrets = await secretsManager.getSecrets();

  const valid = await verifyToken(cf, secrets.ClientID, secrets.UserPoolID);
  console.log(`Is Token Valid: ${valid}`);
  if (valid === true) {
    return cf.request;
  } else {
    return {
      status: "302",
      statusDescription: "Found",
      headers: {
        location: [
          {
            // instructs browser to redirect after receiving the response
            key: "Location",
            value: `https://${secrets.DomainName}.auth.us-east-1.amazoncognito.com/login?client_id=${secrets.ClientID}&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2F${secrets.DistributionDomainName}/index.html`,
          },
        ],
      },
    };
  }
};
