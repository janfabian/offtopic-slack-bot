const { umzug, init } = require("./umzug");

(async () => {
  await init();
  return umzug.up();
})();
