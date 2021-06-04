const { testUmzug } = require("../../database/migrations/umzug");
const { dynamodb } = require("../../database/dynamo");

jest.setTimeout(10000);

beforeEach(async () => {
  const tables = await dynamodb.listTables().promise();
  await Promise.all(
    tables.TableNames?.map((tableName) =>
      dynamodb
        .deleteTable({
          TableName: tableName,
        })
        .promise()
    )
  );

  return testUmzug.up();
});
