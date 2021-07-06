"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const dotenv = require("dotenv");
const { DYNAMODB_TABLES } = require("./dynamo");

const config = new pulumi.Config();
const names = JSON.parse(config.require("env_files")) || [];
const SLACK_TOKEN = config.require("SLACK_TOKEN");

const environment = names.reduce(
  (res, path) => ({
    ...res,
    ...dotenv.config({ path }).parsed,
  }),
  {}
);

const lambdaPackageName = "offtopic-slack-bot--package-lambda";

const lambdaRole = new aws.iam.Role(lambdaPackageName, {
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

const lambdaPolicy = new aws.iam.Policy(lambdaPackageName, {
  policy: pulumi
    .all([
      Object.values(DYNAMODB_TABLES).map((table) => table.streamArn),
      Object.values(DYNAMODB_TABLES).map((table) => table.arn),
    ])
    .apply(([streamArns, tableArns]) => [streamArns.filter(Boolean), tableArns])
    .apply(
      ([streamArns, tableArns]) => `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:*"
        ],
        "Resource": ${JSON.stringify(tableArns)}
      },
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:*"
        ],
        "Resource": ${JSON.stringify(streamArns)}
      }
    ]
    }
`
    ),
});

new aws.iam.RolePolicyAttachment(lambdaPackageName + "-lambdaExecute", {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

new aws.iam.RolePolicyAttachment(lambdaPackageName + "-customPolicy", {
  role: lambdaRole,
  policyArn: lambdaPolicy.arn,
});

const dynamoTableNames = Object.entries(DYNAMODB_TABLES).reduce(
  (obj, [key, table]) => ({ ...obj, [key]: table.name }),
  {}
);

const onInstallation = new aws.lambda.Function(
  lambdaPackageName + "-onInstallation",
  {
    code: new pulumi.asset.FileArchive("./package.lambda"),
    handler: "package/lambda/on-installation.handler",
    runtime: "nodejs14.x",
    role: lambdaRole.arn,
    timeout: 10,
    memorySize: 128,
    environment: {
      variables: {
        ...environment,
        SLACK_TOKEN,
        ...dynamoTableNames,
        NODE_ENV: "production",
      },
    },
  }
);

DYNAMODB_TABLES.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS.onEvent(
  lambdaPackageName + "-onInstallation",
  onInstallation,
  {
    startingPosition: "LATEST",
  }
);

const apiBackend = new aws.lambda.Function(lambdaPackageName + "-apiBackend", {
  code: new pulumi.asset.FileArchive("./package.backend"),
  handler: "package/backend/serverless.handler",
  runtime: "nodejs14.x",
  role: lambdaRole.arn,
  timeout: 10,
  memorySize: 128,
  environment: {
    variables: {
      ...environment,
      SLACK_TOKEN,
      ...dynamoTableNames,
      NODE_ENV: "production",
    },
  },
});

module.exports.apiBackend = apiBackend;
