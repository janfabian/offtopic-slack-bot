"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const dotenv = require("dotenv");
const { DYNAMODB_TABLE_NAMES } = require("./dynamo");

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
    variables: {
      ...environment,
      SLACK_TOKEN,
      ...DYNAMODB_TABLE_NAMES,
    },
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

const webDnsZone = new aws.route53.getZone({
  name: config.require("ROUTE53_ZONE_NAME"),
});

const domain = config.require("ROUTE53_DOMAIN");

const awsUsEast1 = new aws.Provider("usEast1", { region: "us-east-1" });
const sslCert = new aws.acm.Certificate(
  "sslCert",
  {
    domainName: domain,
    validationMethod: "DNS",
  },
  { provider: awsUsEast1 }
);

const sslCertValidationRecord = new aws.route53.Record(
  "sslCertValidationRecord",
  {
    zoneId: webDnsZone.then((zone) => zone.id),
    name: sslCert.domainValidationOptions[0].resourceRecordName,
    type: sslCert.domainValidationOptions[0].resourceRecordType,
    records: [sslCert.domainValidationOptions[0].resourceRecordValue],
    ttl: 10 * 60,
  }
);

const sslCertValidationIssued = new aws.acm.CertificateValidation(
  "sslCertValidationIssued",
  {
    certificateArn: sslCert.arn,
    validationRecordFqdns: [sslCertValidationRecord.fqdn],
  },
  { provider: awsUsEast1 }
);

const webDomain = new aws.apigateway.DomainName("webCdn", {
  certificateArn: sslCertValidationIssued.certificateArn,
  domainName: domain,
});

// eslint-disable-next-line no-unused-vars
const webDomainMapping = new aws.apigateway.BasePathMapping(
  "webDomainMapping",
  {
    restApi: api.restAPI,
    stageName: api.stage.stageName,
    domainName: webDomain.id,
  }
);

// eslint-disable-next-line no-unused-vars
const webDnsRecord = new aws.route53.Record(
  "webDnsRecord",
  {
    name: webDomain.domainName,
    type: "A",
    zoneId: webDnsZone.then((zone) => zone.id),
    aliases: [
      {
        evaluateTargetHealth: true,
        name: webDomain.cloudfrontDomainName,
        zoneId: webDomain.cloudfrontZoneId,
      },
    ],
  },
  { dependsOn: sslCertValidationIssued }
);

module.exports.url = api.url;
