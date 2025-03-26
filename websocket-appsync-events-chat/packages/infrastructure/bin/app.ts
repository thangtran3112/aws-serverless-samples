#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AppSyncEventsChatStack } from "../lib/appsync-events-chat";

const app = new cdk.App();
const AWS_ACCOUNT = "654654352356";
const AWS_REGION = "us-west-2";
new AppSyncEventsChatStack(app, "AppSyncEventsChatStack", {
    env: {
        account: AWS_ACCOUNT,
        region: AWS_REGION,
    },
});