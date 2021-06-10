const Router = require("@koa/router");
const { WebClient } = require("@slack/web-api");
const createHttpError = require("http-errors");
const { documentClient } = require("../../database/dynamo");
const router = new Router();
const web = new WebClient(process.env.SLACK_TOKEN);

router.get("/", async (ctx, next) => {
  const code = new URLSearchParams(ctx.search).get("code");
  if (!code) {
    throw createHttpError(422, "Missing code");
  }

  const r = await web.oauth.v2.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: code,
  });

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
      Item: {
        teamId: r.team.id,
        botId: r.bot_user_id,
        accessToken: r.access_token,
      },
    })
    .promise();

  ctx.status = 200;

  return next();
});

module.exports = router;
