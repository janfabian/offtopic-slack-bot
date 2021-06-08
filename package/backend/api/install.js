const Router = require("@koa/router");
const { WebClient } = require("@slack/web-api");
const createHttpError = require("http-errors");
const { record } = require("../../lib/nock");
const router = new Router();
const web = new WebClient(process.env.SLACK_TOKEN);

router.get("/", async (ctx, next) => {
  const code = new URLSearchParams(ctx.search).get("code");
  if (!code) {
    throw createHttpError(422, "Missing code");
  }

  // record(__filename);

  const r = await web.oauth.v2.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: code,
  });

  console.log(r);

  ctx.status = 200;

  return next();
});

module.exports = router;
