module.exports.CALLBACK_TYPES = {
  URL_VERIFICATION: "url_verification",
  EVENT_CALLBACK: "event_callback",
};

module.exports.EVENT_TYPES = {
  MESSAGE: "message",
};

module.exports.verifyEndpoint = (body) => {
  return { challenge: body.challenge };
};
