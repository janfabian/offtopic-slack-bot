const nock = require("nock");
const request = require("supertest");
const { documentClient } = require("../../database/dynamo.js");
const app = require("../app.js");
const { messageAction } = require("./interactivity.sample.js");

test("interactivity message action", async () => {
  const response = await request(app.callback())
    .post("/interactivity")
    .send(messageAction);

  console.log(response.body);
  expect(response.status).toBe(200);

  // const d = await documentClient
  //   .get({
  //     TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
  //     Key: {
  //       teamId: teamId,
  //     },
  //   })
  //   .promise();

  // expect(d.Item).toEqual(
  //   expect.objectContaining({
  //     botId: expect.any(String),
  //     accessToken: expect.any(String),
  //     createdAt: expect.any(String),
  //     updatedAt: expect.any(String),
  //   })
  // );
});
