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

const packageName = "offtopic-slack-bot--package-backend";

const serverlessKoaRole = new aws.iam.Role(packageName, {
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

new aws.iam.RolePolicyAttachment(packageName, {
  role: serverlessKoaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const backend = new aws.lambda.Function(packageName, {
  code: new pulumi.asset.FileArchive("./package.backend"),
  handler: "package/backend/serverless.handler",
  runtime: "nodejs14.x",
  role: serverlessKoaRole.arn,
  environment: {
    variables: environment,
  },
});

const api = new awsx.apigateway.API(packageName, {
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
