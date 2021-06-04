const MIGRATION_TABLE_NAME = process.env.DYNAMODB_TABLE_MIGRATIONS;

module.exports.MIGRATION_TABLE_NAME = MIGRATION_TABLE_NAME;

class DynamoStorage {
  constructor({ documentClient, dynamodb }) {
    this.dynamodb = dynamodb;
    this.documentClient = documentClient;
  }
  logMigration(name) {
    const params = {
      TableName: MIGRATION_TABLE_NAME,
      Item: {
        Id: name,
      },
    };
    return this.documentClient.put(params).promise();
  }
  unlogMigration(name) {
    const params = {
      TableName: MIGRATION_TABLE_NAME,
      Key: {
        Id: name,
      },
    };
    return this.documentClient.delete(params).promise();
  }
  executed() {
    const params = {
      TableName: MIGRATION_TABLE_NAME,
      ProjectionExpression: "Id",
    };

    return this.documentClient
      .scan(params)
      .promise()
      .then((r) => {
        return r.Items.map(({ Id }) => Id);
      });
  }
}

module.exports.DynamoStorage = DynamoStorage;
