const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);

const fetch = require("node-fetch");
const error = require("./middleware/error.js");

const app = new Koa();
const publicRouter = new Router();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(error());
app.use(bodyParser());

publicRouter.post("/events", async (ctx) => {
  const { event } = ctx.request.body;
  const r = await web.conversations.replies({
    channel: event.channel,
    ts: event.thread_ts,
    // limit: 2,
  });

  console.log(ctx.request.body);

  const count = r.messages[0].reply_count - 1;
  const link = await web.chat.getPermalink({
    channel: event.channel,
    message_ts: event.ts,
  });

  // const channelId = "C022Z4FQCQ2";
  // const ts = "1622110687.002200";

  // const status = await web.chat.postMessage({
  //   channel: channelId,
  //   text: "offtopic thread is on fire " + count,
  //   thread_ts: ts,
  // });

  const channelId = "C022Z4FQCQ2";
  const ts = "1622111276.002800";

  const status = await web.chat.update({
    channel: channelId,
    ts: ts,
    text:
      "offtopic thread is on fire " +
      count +
      ` - <${link.permalink}|check it out>`,
  });

  console.log(status);

  ctx.status = 200;
});

publicRouter.get("/", (ctx) => {
  console.log("GET");
  console.log(ctx.request.body);
  ctx.status = 200;
});

publicRouter.get("/test", async (ctx) => {
  ctx.status = 200;
});

publicRouter.post("/", async (ctx, next) => {
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

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

module.exports = app;
