const Router = require("@koa/router");
const router = new Router();

const createHttpError = require("http-errors");
const { documentClient } = require("../../database/dynamo");
const { PAYLOAD_TYPES, CALLBACK_IDS, VIEWS } = require("../lib/interactivity");
const util = require("util");
const { record } = require("../../lib/nock");
const { addTimestamps } = require("../../lib/dynamodb");
const { THREAD_TYPE } = require("../../lib/constants");
const { createThread, getClient } = require("../../lib/slack");
const { logger } = require("../../lib/logger");
const { default: fetch } = require("node-fetch");

router.post("/", async (ctx, next) => {
  const payload = JSON.parse(ctx.request.body.payload);
  // record(__filename);
  // console.log(ctx.request.body);
  // console.log(util.inspect({ payload }, false, 100, true));
  ctx.body = "";
  ctx.status = 200;

  await next();
  switch (payload.type) {
    case PAYLOAD_TYPES.VIEW_SUBMISSION: {
      return;
    }
    case PAYLOAD_TYPES.BLOCK_ACTIONS: {
      await fetch(payload.response_url, {
        method: "POST",
        body: JSON.stringify({ delete_original: true }),
      }).catch((e) => console.error(e));

      return;
    }
    case PAYLOAD_TYPES.MESSAGE_ACTION: {
      const installationDoc = await documentClient
        .get({
          TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
          Key: { teamId: payload.team.id },
        })
        .promise();

      const web = getClient(installationDoc.Item.accessToken);

      const offtopicChannelDoc = await documentClient
        .get({
          TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
          Key: { teamId: payload.team.id },
        })
        .promise();

      if (!offtopicChannelDoc.Item) {
        try {
          await web.views.open(VIEWS[CALLBACK_IDS.SETUP](payload.trigger_id));
        } catch (error) {
          console.log(error);
        }
        return;
      }

      const threadOrMessageId = payload.message.thread_ts || payload.message_ts;

      const offtopicThreadDoc = await documentClient
        .get({
          TableName: process.env.DYNAMODB_TABLE_THREADS,
          Key: {
            teamId: payload.team.id,
            messageId: threadOrMessageId,
          },
        })
        .promise();

      let offtopicChannelId;
      let offtopicMessageId;

      if (offtopicThreadDoc.Item) {
        offtopicChannelId = offtopicThreadDoc.Item.threadChannelId;
        offtopicMessageId = offtopicThreadDoc.Item.headerId;
      } else {
        const {
          offtopic: { header, thread },
        } = await createThread(
          web,
          payload.channel.id,
          threadOrMessageId,
          offtopicChannelDoc.Item.channelId
        );

        await Promise.all([
          documentClient
            .put({
              TableName: process.env.DYNAMODB_TABLE_THREADS,
              Item: addTimestamps(
                {
                  teamId: payload.team.id,
                  messageId: threadOrMessageId,
                  channelId: payload.channel.id,
                  threadId: thread.ts,
                  headerId: header.ts,
                  threadChannelId: thread.channel,
                  type: THREAD_TYPE.ORIGINAL_MESSAGE,
                },
                true
              ),
            })
            .promise(),
          documentClient
            .put({
              TableName: process.env.DYNAMODB_TABLE_THREADS,
              Item: addTimestamps(
                {
                  teamId: payload.team.id,
                  messageId: thread.ts,
                  channelId: thread.channel,
                  originalMessageId: threadOrMessageId,
                  originalMessageChannelId: payload.channel.id,
                  headerId: header.ts,
                  type: THREAD_TYPE.OFFTOPIC_MESSAGE,
                },
                true
              ),
            })
            .promise(),
        ]);

        offtopicChannelId = header.channel;
        offtopicMessageId = header.ts;
      }

      logger.backend({ offtopicMessageId, offtopicChannelId });

      const otlink = await web.chat.getPermalink({
        channel: offtopicChannelId,
        message_ts: offtopicMessageId,
      });

      await web.chat
        .postEphemeral({
          channel: payload.channel.id,
          user: payload.user.id,
          // thread_ts: payload.message_ts,
          text: `Reply in the <${otlink.permalink}|offtopic message>`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Reply in the <${otlink.permalink}|offtopic message>`,
              },
              accessory: {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Hide",
                },
                value: "follow",
                action_id: "button-action",
              },
            },
          ],
        })
        .catch((e) => console.error(e));

      return;
    }
    default: {
      throw createHttpError(422);
    }
  }
});

module.exports = router;
