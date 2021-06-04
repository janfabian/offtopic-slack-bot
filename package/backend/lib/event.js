module.exports.EVENT_TYPES = {
  URL_VERIFICATION: "url_verification",
  EVENT_CALLBACK: "event_callback",
};

module.exports.verifyEndpoint = (body) => {
  return { challenge: body.challenge };
};

// module.exports.
