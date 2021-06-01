"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const dotenv = require("dotenv");

const config = new pulumi.Config();
const names = JSON.parse(config.require("env_files")) || [];

const environment = names.reduce(
  (res, path) => ({
    ...res,
    ...dotenv.config({ path }).parsed,
  }),
  {}
);

const backendPackageName = "offtopic-slack-bot--package-backend";

const lambdaRole = new aws.iam.Role(backendPackageName, {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment(backendPackageName, {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const backend = new aws.lambda.Function(backendPackageName, {
  code: new pulumi.asset.FileArchive("./package.backend"),
  handler: "package/backend/serverless.handler",
  runtime: "nodejs14.x",
  role: lambdaRole.arn,
  environment: {
    variables: environment,
  },
});

const api = new awsx.apigateway.API(backendPackageName, {
  routes: [
    {
      path: "/",
      method: "ANY",
      eventHandler: backend,
    },
    {
      path: "/{proxy+}",
      method: "ANY",
      eventHandler: backend,
    },
  ],
});

module.exports.url = api.url;
