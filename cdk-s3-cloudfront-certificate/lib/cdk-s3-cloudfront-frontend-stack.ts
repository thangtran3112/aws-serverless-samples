import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CreateS3 } from "./modules/create-s3";
import { ConfigureAccessPolicyS3 } from "./modules/configure-access-policy-s3";
import { WEBSITES } from "./config/websites";
import { CreateCFDistribution } from "./modules/create-cf-distribution";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { GetCertificate } from "./modules/get-certificate";

export class CdkS3CloudfrontFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { ...props, crossRegionReferences: true });

    const bucketNames = WEBSITES.map((website) => website.bucketName);
    const uniqueBucketNames = [...new Set(bucketNames)];

    const websiteBuckets: Record<string, Bucket> = {};
    for (const bucketName of uniqueBucketNames) {
      websiteBuckets[bucketName] = new CreateS3(this, {
        bucketName: bucketName,
      }).siteBucket;

      new CfnOutput(this, "S3BucketName", {
        value: `s3://${bucketName}`,
        description: "Created aws s3 bucket",
      });
    }

    for (const website of WEBSITES) {
      const websiteProps = {
        bucketName: website.bucketName,
        cfDistributionName: `${website.alias}-CF-dist`,
        domainName: website.domain,
        accessIdentityName: `${website.alias}-AccessIdentity`,
        certName: `${website.alias}-Cert`,
      };

      const siteBucket = websiteBuckets[websiteProps.bucketName];

      const accessIdentity = new ConfigureAccessPolicyS3(this, {
        siteBucket: siteBucket,
        accessIdentityName: websiteProps.accessIdentityName,
      }).accessIdentity;

      const cert = new GetCertificate(this, {
        domainName: websiteProps.domainName,
      }).cert;

      const cfDist = new CreateCFDistribution(this, {
        siteBucket: siteBucket,
        accessIdentity: accessIdentity,
        cert,
        cfDistributionName: websiteProps.cfDistributionName,
        domainName: websiteProps.domainName,
      }).cfDist;

      new CfnOutput(this, `${websiteProps.domainName}-CfDomainName`, {
        value: cfDist.distributionDomainName,
        description: "Create a CNAME record with of this CF distribution URL",
      });

      new CfnOutput(this, `${websiteProps.domainName}-CfDistId`, {
        value: cfDist.distributionId,
        description:
          "Use this ID to perform a cache invalidation to see changes to your site immediately",
      });
    }
  }
}
