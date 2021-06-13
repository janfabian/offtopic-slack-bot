const Router = require("@koa/router");
const router = new Router();

const { WebClient } = require("@slack/web-api");
const createHttpError = require("http-errors");
const { default: fetch } = require("node-fetch");
const { documentClient } = require("../../database/dynamo");
const { PAYLOAD_TYPES } = require("../lib/interactivity");
const { createThread } = require("../lib/slack");
const util = require("util");
const web = new WebClient(process.env.SLACK_TOKEN);

router.post("/", async (ctx, next) => {
  const payload = JSON.parse(ctx.request.body.payload);
  console.log(ctx.request.body);
  console.log(util.inspect({ payload }, false, 100, true));
  ctx.body = "";
  ctx.status = 200;

  await next();
  console.log("type", payload.type);
  switch (payload.type) {
    case PAYLOAD_TYPES.BLOCK_ACTIONS: {
      console.log(payload.actions);

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

      console.log("item", offtopicChannel.Item);

      if (!offtopicChannel.Item) {
        try {
          await web.views.open({
            trigger_id: payload.trigger_id,
            view: {
              type: "modal",
              callback_id: "setup",
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
        "C023BNKU9FB"
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

  // const c = await web.conversations.open({
  //   users: payload.user.id,
  // });

  // await web.chat.postMessage({
  //   channel: c.channel.id,
  //   text: "FOOO",
  // });

  // const {
  //   offtopic: { header },
  // } = await createThread(payload.channel.id, payload.message_ts);

  // const link = await web.chat.getPermalink({
  //   channel: payload.channel.id,
  //   message_ts: payload.message_ts,
  // });

  // const pm = await web.chat.postMessage({
  //   channel: "C023BNKU9FB",
  //   text: "offtopic thread",
  // });

  // const m = await web.chat.postMessage({
  //   channel: "C023BNKU9FB",
  //   text: `<${link.permalink}|original message>`,
  //   thread_ts: pm.ts,
  // });

  // const otlink = await web.chat.getPermalink({
  //   channel: header.channel,
  //   message_ts: header.ts,
  // });

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
