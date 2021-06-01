const Koa = require("koa");
const foo = require("../lib/foo.js");

const app = new Koa();

app.use((ctx) => {
  ctx.body = foo();
});

module.exports = app;
