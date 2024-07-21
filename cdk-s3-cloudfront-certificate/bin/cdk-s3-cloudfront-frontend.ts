#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkS3CloudfrontFrontendStack } from "../lib/cdk-s3-cloudfront-frontend-stack";
import { UsEastCertificateStack } from "../lib/us-east-certificate-stack";
import { EcsWithEc2LaunchTypeStack } from "../lib/ecs-launch-type-ec2-stack";
require("dotenv").config();

const app = new cdk.App();

new UsEastCertificateStack(app, "UsEastCertificateStack", {
  env: { region: "us-east-1" }, // us-east-1 is the only region where ACM certificates can be created
});

new CdkS3CloudfrontFrontendStack(app, "CdkS3CloudfrontFrontendStack", {
  env: {
    region: process.env.AWS_ACCOUNT_REGION,
  },
});

new EcsWithEc2LaunchTypeStack(app, "EcsLaunchEc2Stack", {
  env: {
    region: process.env.AWS_ACCOUNT_REGION,
  },
});
