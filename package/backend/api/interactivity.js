const Router = require("@koa/router");
const router = new Router();

const R = require("ramda");
const { WebClient } = require("@slack/web-api");
const createHttpError = require("http-errors");
const { default: fetch } = require("node-fetch");
const { documentClient } = require("../../database/dynamo");
const {
  PAYLOAD_TYPES,
  CALLBACK_IDS,
  BLOCK_IDS,
} = require("../lib/interactivity");
const { createThread } = require("../lib/slack");
const util = require("util");
const { record } = require("../../lib/nock");
const { addTimestamps } = require("../../lib/dynamodb");
const web = new WebClient(process.env.SLACK_TOKEN);

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
      const selectedChannel = R.path([
        "view",
        "state",
        "values",
        BLOCK_IDS.CHANNEL_SELECT,
        "multi_conversations_select-action",
        "selected_conversation",
      ])(payload);

      await documentClient
        .put({
          TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
          Item: addTimestamps(
            {
              teamId: payload.team.id,
              channelId: selectedChannel,
            },
            true
          ),
        })
        .promise();

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
      const offtopicChannel = await documentClient
        .get({
          TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
          Key: { teamId: payload.team.id },
        })
        .promise();

      if (!offtopicChannel.Item) {
        try {
          await web.views.open({
            trigger_id: payload.trigger_id,
            view: {
              type: "modal",
              callback_id: CALLBACK_IDS.SETUP,
              title: {
                type: "plain_text",
                text: "Offtopic setup",
                emoji: true,
              },
              submit: {
                type: "plain_text",
                text: "Submit",
                emoji: true,
              },
              close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true,
              },
              blocks: [
                {
                  type: "input",
                  block_id: BLOCK_IDS.CHANNEL_SELECT,
                  label: {
                    type: "plain_text",
                    text: "Select a channel to which will store the offtopic threads",
                  },
                  element: {
                    type: "conversations_select",
                    placeholder: {
                      type: "plain_text",
                      text: "Select conversations",
                      emoji: true,
                    },
                    filter: {
                      include: ["public"],
                    },
                    action_id: "multi_conversations_select-action",
                  },
                },
              ],
            },
          });
        } catch (error) {
          console.log(error);
        }
        return;
      }

      const {
        offtopic: { header },
      } = await createThread(
        payload.channel.id,
        payload.message_ts,
        offtopicChannel.Item.channelId
      );

      const otlink = await web.chat.getPermalink({
        channel: header.channel,
        message_ts: header.ts,
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

  // await web.chat
  //   .postEphemeral({
  //     channel: payload.channel.id,
  //     user: payload.user.id,
  //     // thread_ts: payload.message_ts,
  //     text: `Reply in the <${otlink.permalink}|offtopic message>`,
  //     blocks: [
  //       {
  //         type: "section",
  //         text: {
  //           type: "mrkdwn",
  //           text: `Reply in the <${otlink.permalink}|offtopic message>`,
  //         },
  //         accessory: {
  //           type: "button",
  //           text: {
  //             type: "plain_text",
  //             text: "Hide",
  //           },
  //           value: "follow",
  //           action_id: "button-action",
  //         },
  //       },
  //     ],
  //   })
  //   .catch((e) => console.error(e));
});

module.exports = router;
