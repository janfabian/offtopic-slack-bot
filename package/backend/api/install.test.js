const nock = require("nock");
const request = require("supertest");
const { documentClient } = require("../../database/dynamo.js");
const app = require("../app.js");
const { code } = require("./install.sample.js");

test("install missing code", async () => {
  const response = await request(app.callback()).get("/install");
  expect(response.status).toBe(422);
});

test("install and save to dynamo", async () => {
  nock.load("./api/nocks/install.01.json");

  const response = await request(app.callback()).get("/install").query({
    code,
  });
  expect(response.status).toBe(200);

  const teamId = require("./nocks/install.01.json")[0].response.team.id;

  const d = await documentClient
    .get({
      TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
      Key: {
        teamId: teamId,
      },
    })
    .promise();

  expect(d.Item).toEqual(
    expect.objectContaining({
      botId: expect.any(String),
      accessToken: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  );
});

test("install invalid code", async () => {
  nock.load("./api/nocks/install.02.json");

  const response = await request(app.callback()).get("/install").query({
    code: "invalid",
  });
  expect(response.status).toBe(401);

  const d = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_WORKSPACE_INSTALLATIONS,
    })
    .promise();

  expect(d.Items).toHaveLength(0);
});
