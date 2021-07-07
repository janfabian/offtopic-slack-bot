const log = require("debug")("offtopic-slack-bot");
module.exports.logger = { backend: log.extend("backend") };
