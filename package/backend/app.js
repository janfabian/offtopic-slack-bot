const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const error = require("./middleware/error.js");
const EventsRouter = require("./api/events.js");
const InterRouter = require("./api/interactivity.js");
const InstallRouter = require("./api/install.js");
const logger = require("./middleware/logger.js");

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin: process.env.PREACT_PUBLIC_FRONTEND_URL,
  })
);

app.use(error());
app.use(bodyParser());
app.use(logger());

router.get("/", (ctx) => {
  ctx.status = 200;
});

const routes = [
  ["/events", EventsRouter.routes(), EventsRouter.allowedMethods()],
  ["/interactivity", InterRouter.routes(), InterRouter.allowedMethods()],
  ["/install", InstallRouter.routes(), InstallRouter.allowedMethods()],
];

routes.map((r) => router.use(...r));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
