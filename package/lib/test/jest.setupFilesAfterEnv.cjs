const { testUmzug } = require("../../database/migrations/umzug");
const { dynamodb } = require("../../database/dynamo");
const nock = require("nock");

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

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});
