const { documentClient } = require("../database/dynamo");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { handler } = require("./on-installation");

(async () => {
  const installationDocs = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
    })
    .promise();

  for (const installationDoc of installationDocs.Items) {
    const channelDoc = await documentClient
      .get({
        TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
        Key: {
          teamId: installationDoc.teamId,
        },
      })
      .promise();

    if (channelDoc.Item) {
      continue;
    }

    const event = {
      Records: [
        {
          eventName: "INSERT",
          dynamodb: {
            Keys: marshall({
              teamId: installationDoc.teamId,
            }),
            NewImage: marshall(installationDoc),
          },
        },
      ],
    };

    return handler(event);
  }
})();
