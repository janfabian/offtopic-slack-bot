const { documentClient } = require("../database/dynamo");
const R = require("ramda");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const {
  DEFAULT_APP_CONVERSATION_NAME,
  findConversation,
  getClient,
} = require("../lib/slack");
const { addTimestamps } = require("../lib/dynamodb");

const slackProcess = async (slackInstallation) => {
  const web = getClient(slackInstallation.accessToken);

  const createOrJoin = async (attempt = 1) => {
    const name =
      DEFAULT_APP_CONVERSATION_NAME + (attempt > 1 ? `-${attempt}` : "");
    try {
      return await web.conversations.create({
        name: name,
      });
    } catch (e) {
      if (e?.data.error === "name_taken") {
        try {
          const foundChannel = await findConversation(
            web,
            (channel) => channel.name === name
          );

          return await web.conversations.join({
            channel: foundChannel.id,
          });
        } catch (e) {
          return createOrJoin(attempt + 1);
        }
      }

      throw e;
    }
  };

  return createOrJoin();
};

const saveToDynamo = async (teamId, channelId) => {
  await documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
      Item: addTimestamps(
        {
          teamId: teamId,
          channelId: channelId,
        },
        true
      ),
    })
    .promise();
};

exports.handler = async function (event) {
  return await R.pipe(
    R.filter((rec) => ["INSERT", "MODIFY"].includes(rec.eventName)),
    R.map((rec) => unmarshall(rec.dynamodb.NewImage)),
    R.map(async (doc) => {
      const { channel } = await slackProcess(doc);
      const saveResult = await saveToDynamo(doc.teamId, channel.id);

      return [channel, saveResult];
    }),
    R.bind(Promise.all, Promise)
  )(event.Records);
};
