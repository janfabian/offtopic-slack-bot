const Router = require("@koa/router");
const router = new Router();

const { WebClient } = require("@slack/web-api");
const { default: fetch } = require("node-fetch");
const web = new WebClient(process.env.SLACK_TOKEN);

router.post("/", async (ctx, next) => {
  console.log("POST");
  const payload = JSON.parse(ctx.request.body.payload);
  console.log({ body: ctx.request.body });
  console.log({ payload });
  ctx.body = "";
  ctx.status = 200;

  await next();

  if (payload.type === "block_actions") {
    console.log(payload.actions);

    await fetch(payload.response_url, {
      method: "POST",
      body: JSON.stringify({ delete_original: true }),
    }).catch((e) => console.error(e));

    return;
  }

  // const c = await web.conversations.open({
  //   users: payload.user.id,
  // });

  // await web.chat.postMessage({
  //   channel: c.channel.id,
  //   text: "FOOO",
  // });

  const link = await web.chat.getPermalink({
    channel: payload.channel.id,
    message_ts: payload.message_ts,
  });
  // console.log({
  //   channel: payload.channel.id,
  //   message_ts: payload.message_ts,
  // });
  // console.log(link.permalink);

  const pm = await web.chat.postMessage({
    channel: "C023BNKU9FB",
    text: "offtopic thread",
  });

  const m = await web.chat.postMessage({
    channel: "C023BNKU9FB",
    text: `<${link.permalink}|original message>`,
    thread_ts: pm.ts,
  });

  const otlink = await web.chat.getPermalink({
    channel: m.channel,
    message_ts: m.ts,
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

  // try {
  //   await web.views.open({
  //     trigger_id: payload.trigger_id,
  //     view: {
  //       type: "modal",
  //       callback_id: "modal-identifier",
  //       title: {
  //         type: "plain_text",
  //         text: "Just a modal",
  //       },
  //       blocks: [
  //         {
  //           type: "section",
  //           block_id: "section-identifier",
  //           text: {
  //             type: "mrkdwn",
  //             text: "*Welcome* to ~my~ Block Kit _modal_!",
  //           },
  //           accessory: {
  //             type: "button",
  //             text: {
  //               type: "plain_text",
  //               text: "Just a button",
  //             },
  //             action_id: "button-identifier",
  //           },
  //         },
  //       ],
  //     },
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
});

module.exports = router;
