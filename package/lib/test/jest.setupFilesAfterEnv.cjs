const { testUmzug } = require("../../database/migrations/umzug");
const { dynamodb } = require("../../database/dynamo");
const nock = require("nock");

jest.setTimeout(10000);

beforeEach(async () => {
  let timeoutResolve;
  const tables = await Promise.race([
    dynamodb.listTables().promise(),
    new Promise((res, reject) => {
      timeoutResolve = setTimeout(() => {
        return reject(new Error("internal:timeout"));
      }, 5000);
    }),
  ]).catch((e) => {
    if (e.message === "internal:timeout") {
      console.warn(
        "Local instance of Dynamo seems unreachable - try `npm run docker-compose:test up`"
      );
    } else {
      throw e;
    }
  });

  clearTimeout(timeoutResolve);

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
