const Router = require("@koa/router");
const router = new Router();

const { WebClient } = require("@slack/web-api");
const { EVENT_TYPES, verifyEndpoint } = require("../lib/event");
const web = new WebClient(process.env.SLACK_TOKEN);

router.post("/", async (ctx, next) => {
  const body = ctx.request.body;
  console.log(body);
  switch (body.type) {
    case EVENT_TYPES.URL_VERIFICATION: {
      ctx.body = verifyEndpoint(body);
      break;
    }
    case EVENT_TYPES.EVENT_CALLBACK: {
      ctx.status = 200;
      break;
    }
    default: {
      ctx.status = 200;
    }
  }

  return next();

  // const r = await web.conversations.replies({
  //   channel: event.channel,
  //   ts: event.thread_ts,
  //   // limit: 2,
  // });

  // const count = r.messages[0].reply_count - 1;
  // const link = await web.chat.getPermalink({
  //   channel: event.channel,
  //   message_ts: event.ts,
  // });

  // const channelId = "C022Z4FQCQ2";
  // const ts = "1622110687.002200";

  // const status = await web.chat.postMessage({
  //   channel: channelId,
  //   text: "offtopic thread is on fire " + count,
  //   thread_ts: ts,
  // });

  // const channelId = "C022Z4FQCQ2";
  // const ts = "1622111276.002800";

  // const status = await web.chat.update({
  //   channel: channelId,
  //   ts: ts,
  //   text:
  //     "offtopic thread is on fire " +
  //     count +
  //     ` - <${link.permalink}|check it out>`,
  // });
});

module.exports = router;
