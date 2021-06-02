module.exports.tableName = (name) =>
  (process.env.DYNAMODB_TABLE_PREFIX || "") + "." + name;
