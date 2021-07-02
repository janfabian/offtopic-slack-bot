const { umzug, init } = require("./umzug");

(async () => {
  await init();
  return umzug.up();
})().then((r) => console.log(r));
