const { logger } = require("../../lib/logger");

module.exports = () => async (ctx, next) => {
  logger.backend("=== REQUEST ===");
  logger.backend(ctx.request.body);
  try {
    await next();
  } catch (e) {
    logger.backend("=== ERROR ===");
    logger.backend(JSON.stringify(e, null, 4));
    throw e;
  }
  logger.backend("=== RESPONSE ===");
  logger.backend(ctx.status);
  logger.backend(ctx.body);
};
