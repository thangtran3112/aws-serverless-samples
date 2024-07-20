import { RemovalPolicy } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface StackProps {
  bucketName: string;
}

export class CreateS3 {
  siteBucket: Bucket;

  constructor(scope: Construct, props: StackProps) {
    this.siteBucket = new Bucket(scope, props.bucketName, {
      bucketName: props.bucketName,
      accessControl: BucketAccessControl.PRIVATE,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
