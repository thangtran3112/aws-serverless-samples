# Deploy S3 Website and assets to Cloudfront with a certificate

- [Original article](https://medium.com/@mhkafadar/a-practical-aws-cdk-walkthrough-deploying-multiple-websites-to-s3-and-cloudfront-7caaabc9c327)

## Steps

- Create your static asset path configs, see [Website Config Sample](./lib//config/websites.example.ts)
- Create `.env` file following following `.env.example`, and update:

```env
AWS_ACCOUNT_NUMBER=YOUR_AWS_ACCOUNT_NUMBER
AWS_ACCOUNT_REGION=YOUR_REGION (us-east-1, eu-north-1, etc.)
```

- Create file under [lib/config folder](./lib/config/) with name as `certificate-arns.json`, with the placeholder content:

```json
{
  <YOUR_DOMAIN_NAME>: "a temporary arn string"
}
```

- Deployments:

```bash
npm i
cdk bootstrap
cdk deploy --all
```

- Make sure to update Route53 DNS to make sure the certificate is validated during cdk deployment

## Testing

- Use the html contents inside [sample](./sample/) for testing cloudfront url
