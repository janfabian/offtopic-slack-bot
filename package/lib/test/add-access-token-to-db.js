const { documentClient } = require("../../database/dynamo");
const { addTimestamps } = require("../dynamodb");

module.exports.addAccessToken = (
  teamId = "teamId",
  botId = "botId",
  accessToken = "accessToken"
) => {
  return documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
      Item: addTimestamps(
        {
          teamId: teamId,
          botId: botId,
          accessToken: accessToken,
        },
        true
      ),
    })
    .promise();
};
