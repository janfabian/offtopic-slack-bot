const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");

const migrationsTable = new aws.dynamodb.Table(
  process.env.DYNAMODB_TABLE_MIGRATIONS,
  {
    attributes: [
      {
        name: "id",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "id",
    tags: {
      Environment: pulumi.getStack(),
    },
  }
);

const workspaceInstallationTable = new aws.dynamodb.Table(
  process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
  {
    attributes: [
      {
        name: "teamId",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "teamId",
    tags: {
      Environment: pulumi.getStack(),
    },
  }
);

module.exports.migrationsTable = migrationsTable;
module.exports.workspaceInstallationTable = workspaceInstallationTable;
module.exports.DYNAMODB_TABLE_NAMES = {
  DYNAMODB_TABLE_MIGRATIONS: migrationsTable.name,
  DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS: workspaceInstallationTable.name,
};
