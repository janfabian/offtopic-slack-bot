const { tableName } = require("../../lib/utils");

const MIGRATION_TABLE_NAME = "Migrations";

module.exports.MIGRATION_TABLE_NAME = MIGRATION_TABLE_NAME;

class DynamoStorage {
  constructor({ documentClient, dynamodb }) {
    this.dynamodb = dynamodb;
    this.documentClient = documentClient;
  }
  logMigration(name) {
    const params = {
      TableName: tableName(MIGRATION_TABLE_NAME),
      Item: {
        id: name,
      },
    };
    return this.documentClient.put(params).promise();
  }
  unlogMigration(name) {
    const params = {
      TableName: tableName(MIGRATION_TABLE_NAME),
      Key: {
        id: name,
      },
    };
    return this.documentClient.delete(params).promise();
  }
  executed() {
    const params = {
      TableName: tableName(MIGRATION_TABLE_NAME),
      ProjectionExpression: "id",
    };

    return this.documentClient
      .scan(params)
      .promise()
      .then((r) => {
        return r.Items.map(({ id }) => id);
      });
  }
}

module.exports.DynamoStorage = DynamoStorage;
