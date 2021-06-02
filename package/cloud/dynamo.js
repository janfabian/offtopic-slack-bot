const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");

const migrationsTable = new aws.dynamodb.Table(
  process.env.DYNAMODB_TABLE_MIGRATION,
  {
    attributes: [
      {
        name: "Id",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "Id",
    tags: {
      Environment: pulumi.getStack(),
    },
  }
);

module.exports.migrationsTable = migrationsTable;
module.exports.DYNAMODB_TABLE_NAMES = {
  DYNAMODB_MIGRATIONS_TABLE: migrationsTable.name,
};
