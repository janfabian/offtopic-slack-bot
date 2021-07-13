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
    streamEnabled: true,
    streamViewType: "NEW_IMAGE",
    billingMode: "PAY_PER_REQUEST",
    hashKey: "teamId",
    tags: {
      Environment: pulumi.getStack(),
    },
  }
);

const offtopicChannelsTable = new aws.dynamodb.Table(
  process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
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

const threadsTable = new aws.dynamodb.Table(
  process.env.DYNAMODB_TABLE_THREADS,
  {
    attributes: [
      {
        name: "teamId",
        type: "S",
      },
      {
        name: "messageId",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "teamId",
    rangeKey: "messageId",
    tags: {
      Environment: pulumi.getStack(),
    },
  }
);

module.exports.migrationsTable = migrationsTable;
module.exports.workspaceInstallationTable = workspaceInstallationTable;
module.exports.DYNAMODB_TABLES = {
  DYNAMODB_TABLE_MIGRATIONS: migrationsTable,
  DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS: workspaceInstallationTable,
  DYNAMODB_TABLE_OFFTOPIC_CHANNELS: offtopicChannelsTable,
  DYNAMODB_TABLE_THREADS: threadsTable,
};
