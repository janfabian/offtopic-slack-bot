"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const { apiBackend } = require("./lambda");

const backendConfig = new pulumi.Config("backend");

const backendPackageName = "offtopic-slack-bot--package-backend";

const api = new awsx.apigateway.API(backendPackageName, {
  routes: [
    {
      path: "/",
      method: "ANY",
      eventHandler: apiBackend,
    },
    {
      path: "/{proxy+}",
      method: "ANY",
      eventHandler: apiBackend,
    },
  ],
});

const webDnsZone = new aws.route53.getZone({
  name: backendConfig.require("ROUTE53_ZONE_NAME"),
});

const domain = backendConfig.require("API_DOMAIN");

const awsUsEast1 = new aws.Provider(backendPackageName + "usEast1", {
  region: "us-east-1",
});
const sslCert = new aws.acm.Certificate(
  backendPackageName + "-sslCert",
  {
    domainName: domain,
    validationMethod: "DNS",
  },
  { provider: awsUsEast1 }
);

const sslCertValidationRecord = new aws.route53.Record(
  backendPackageName + "-sslCertValidationRecord",
  {
    zoneId: webDnsZone.then((zone) => zone.id),
    name: sslCert.domainValidationOptions[0].resourceRecordName,
    type: sslCert.domainValidationOptions[0].resourceRecordType,
    records: [sslCert.domainValidationOptions[0].resourceRecordValue],
    ttl: 10 * 60,
  }
);

const sslCertValidationIssued = new aws.acm.CertificateValidation(
  backendPackageName + "-sslCertValidationIssued",
  {
    certificateArn: sslCert.arn,
    validationRecordFqdns: [sslCertValidationRecord.fqdn],
  },
  { provider: awsUsEast1 }
);

const webDomain = new aws.apigateway.DomainName(backendPackageName + "webCdn", {
  certificateArn: sslCertValidationIssued.certificateArn,
  domainName: domain,
});

// eslint-disable-next-line no-unused-vars
const webDomainMapping = new aws.apigateway.BasePathMapping(
  backendPackageName + "webDomainMapping",
  {
    restApi: api.restAPI,
    stageName: api.stage.stageName,
    domainName: webDomain.id,
  }
);

// eslint-disable-next-line no-unused-vars
const webDnsRecord = new aws.route53.Record(
  backendPackageName + "webDnsRecord",
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

module.exports.url = "https://" + domain;
module.exports.apiGatewayUrl = api.url;
