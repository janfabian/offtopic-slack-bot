const path = require("path");
const { documentClient, dynamodb } = require("../dynamo");

const { DynamoStorage } = require("./DynamoStorage");

const Umzug = require("umzug");
const umzug = new Umzug({
  storage: new DynamoStorage({ documentClient, dynamodb }),
  logger: console,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    params: [documentClient, dynamodb],
    wrap: (fn) => {
      if (process.env.NODE_ENV === "production" && fn.skipForAWS) {
        return () => Promise.resolve();
      }

      return fn;
    },
  },
});

const testUmzug = new Umzug({
  migrations: {
    path: path.join(__dirname, "./migrations"),
    params: [documentClient, dynamodb],
  },
  storage: "none",
});

module.exports.umzug = umzug;
module.exports.testUmzug = testUmzug;
module.exports.init = () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_MIGRATIONS,
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
