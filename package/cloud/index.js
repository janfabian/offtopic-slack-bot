"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

const serverlessKoaRole = new aws.iam.Role("serverlessKoaRole", {
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

new aws.iam.RolePolicyAttachment("zipTpsReportsFuncRoleAttach", {
  role: serverlessKoaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const serverlessKoa = new aws.lambda.Function("serverlessKoa", {
  code: new pulumi.asset.FileArchive("./package.backend"),
  handler: "package/backend/serverless.handler",
  runtime: "nodejs14.x",
  role: serverlessKoaRole.arn,
});

const api = new awsx.apigateway.API("example", {
  routes: [
    {
      path: "/",
      method: "ANY",
      eventHandler: serverlessKoa,
    },
    {
      path: "/{proxy+}",
      method: "ANY",
      eventHandler: serverlessKoa,
    },
  ],
});

module.exports.url = api.url;
