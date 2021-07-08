const Router = require("@koa/router");
const router = new Router();

const { documentClient } = require("../../database/dynamo");
const { getClient } = require("../../lib/slack");
const { CALLBACK_TYPES, verifyEndpoint, EVENT_TYPES } = require("../lib/event");

router.post("/", async (ctx) => {
  const body = ctx.request.body;
  console.log({ body });
  switch (body.type) {
    case CALLBACK_TYPES.URL_VERIFICATION: {
      ctx.body = verifyEndpoint(body);
      return;
    }
    case CALLBACK_TYPES.EVENT_CALLBACK: {
      ctx.status = 200;
      const { event } = body;

      if (event.type === EVENT_TYPES.MESSAGE) {
        const installationDoc = await documentClient
          .get({
            TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
            Key: { teamId: event.team },
          })
          .promise();

        const web = getClient(installationDoc.Item.accessToken);

        if (installationDoc?.Item.botId !== event.parent_user_id) {
          return;
        }

        const offtopicChannelDoc = await documentClient
          .get({
            TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
            Key: { teamId: event.team },
          })
          .promise();

        if (offtopicChannelDoc?.Item.channelId !== event.channel) {
          return;
        }

        const offtopicThreadDoc = await documentClient
          .get({
            TableName: process.env.DYNAMODB_TABLE_THREADS,
            Key: {
              teamId: event.team,
              messageId: event.thread_ts,
            },
          })
          .promise();

        if (!offtopicThreadDoc.Item) {
          return;
        }

        const r = await web.conversations.replies({
          channel: event.channel,
          ts: event.thread_ts,
        });

        const count = r.messages[0].reply_count - 1;

        if (count < 1) {
          return;
        }

        const link = await web.chat.getPermalink({
          channel: event.channel,
          message_ts: event.ts,
        });

        if (offtopicThreadDoc.Item.statusMessageId) {
          await web.chat.update({
            channel: offtopicThreadDoc.Item.originalMessageChannelId,
            ts: offtopicThreadDoc.Item.statusMessageId,
            text:
              "offtopic thread is on fire " +
              count +
              ` - <${link.permalink}|check it out>`,
          });
        } else {
          const message = await web.chat.postMessage({
            channel: offtopicThreadDoc.Item.originalMessageChannelId,
            thread_ts: offtopicThreadDoc.Item.originalMessageId,
            unfurl_links: false,
            unfurl_media: false,
            text:
              "offtopic thread is on fire " +
              count +
              ` - <${link.permalink}|check it out>`,
          });

          await documentClient
            .update({
              TableName: process.env.DYNAMODB_TABLE_THREADS,
              UpdateExpression: "set statusMessageId = :statusMessageId",
              Key: {
                teamId: event.team,
                messageId: event.thread_ts,
              },
              ExpressionAttributeValues: {
                ":statusMessageId": message.ts,
              },
            })
            .promise()
            .catch(async (e) => {
              await web.chat.delete({
                channel: offtopicThreadDoc.Item.originalMessageChannelId,
                ts: message.ts,
              });

              throw e;
            });
        }
      }

      return;
    }
    default: {
      ctx.status = 200;
      return;
    }
  }
});

module.exports = router;
