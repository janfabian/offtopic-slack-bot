const serverless = require("serverless-http");
const app = require("./foo");

module.exports.handler = serverless(app);
