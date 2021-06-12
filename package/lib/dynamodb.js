module.exports.addTimestamps = (doc, created = false) => {
  return {
    ...doc,
    updatedAt: new Date().toJSON(),
    ...(created ? { createdAt: new Date().toJSON() } : {}),
  };
};

module.exports.markDeleted = (doc) => {
  return {
    ...doc,
    deletedAt: new Date().toJSON,
  };
};
