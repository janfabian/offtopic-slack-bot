"use strict";

module.exports = {
  up: async (queryInterface, dynamodb) => {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
      KeySchema: [{ AttributeName: "teamId", KeyType: "HASH" }],
      AttributeDefinitions: [
        {
          AttributeName: "teamId",
          AttributeType: "S",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    };

    return dynamodb.createTable(params).promise();
  },

  down: async (queryInterface, Sequelize) => {},
};
