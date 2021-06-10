const AWS = require("aws-sdk");

if (process.env.NODE_ENV !== "production") {
  AWS.config.update({
    region: "fake-region",
    credentials: {
      accessKeyId: "fake",
      secretAccessKey: "fake",
    },
    endpoint: "http://localhost:" + process.env.DYNAMODB_PORT,
  });
}

module.exports.documentClient = new AWS.DynamoDB.DocumentClient();
module.exports.dynamodb = new AWS.DynamoDB();
