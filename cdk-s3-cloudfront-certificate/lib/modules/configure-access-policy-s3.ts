import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";

interface StackProps {
  siteBucket: Bucket;
  accessIdentityName: string;
}

export class ConfigureAccessPolicyS3 {
  accessIdentity: OriginAccessIdentity;

  constructor(scope: Construct, props: StackProps) {
    const accessIdentity = new OriginAccessIdentity(
      scope,
      props.accessIdentityName
    );
    const cloudfrontUserAccessPolicy = new PolicyStatement();
    cloudfrontUserAccessPolicy.addActions("s3:GetObject");
    cloudfrontUserAccessPolicy.addPrincipals(accessIdentity.grantPrincipal);
    cloudfrontUserAccessPolicy.addResources(
      props.siteBucket.arnForObjects("*")
    );
    props.siteBucket.addToResourcePolicy(cloudfrontUserAccessPolicy);

    this.accessIdentity = accessIdentity;
  }
}
