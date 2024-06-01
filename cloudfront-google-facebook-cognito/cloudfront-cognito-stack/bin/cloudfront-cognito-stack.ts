#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/InfrastructureStack";

const app = new cdk.App();

new InfrastructureStack(app, "Test-InfrastructureStack", {
  env: {
    region: "us-east-1",
  },
});
