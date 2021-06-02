const path = require("path");
const AWS = require("aws-sdk");

const { DynamoStorage, MIGRATION_TABLE_NAME } = require("./DynamoStorage");

AWS.config.update({
  region: "fake-region",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
  endpoint: "http://localhost:" + process.env.DYNAMODB_PORT,
});

const documentClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();

const Umzug = require("umzug");
const { tableName } = require("../../lib/utils");
const umzug = new Umzug({
  storage: new DynamoStorage({ documentClient, dynamodb }),
  logger: console,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    params: [documentClient, dynamodb],
  },
});

module.exports.umzug = umzug;
module.exports.init = () => {
  const params = {
    TableName: tableName(MIGRATION_TABLE_NAME),
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  };

  return dynamodb
    .createTable(params)
    .promise()
    .catch((e) => {
      if (e.code === "ResourceInUseException") {
        // migration table already exists
      } else {
        throw e;
      }
    });
};
