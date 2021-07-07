const nock = require("nock");
const { documentClient } = require("../database/dynamo");
const { handler } = require("./on-installation");
const { newInstallation } = require("./on-installation.sample.js");

test("new install", async () => {
  nock.load("./nocks/on-installation.01.json");

  await handler(newInstallation);

  const offtopicChannels = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
    })
    .promise();

  expect(offtopicChannels.Count).toBe(1);
  expect(offtopicChannels.Items[0]).toEqual(
    expect.objectContaining({
      createdAt: expect.any(String),
      channelId: expect.any(String),
      teamId: expect.any(String),
      updatedAt: expect.any(String),
    })
  );
});

test("new install - join existing channel", async () => {
  nock.load("./nocks/on-installation.02.json");

  await handler(newInstallation);

  const offtopicChannels = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
    })
    .promise();

  expect(offtopicChannels.Count).toBe(1);
  expect(offtopicChannels.Items[0]).toEqual(
    expect.objectContaining({
      createdAt: expect.any(String),
      channelId: expect.any(String),
      teamId: expect.any(String),
      updatedAt: expect.any(String),
    })
  );
});

test("new install - existing channel can't be joined, create a new one", async () => {
  nock.load("./nocks/on-installation.03.json");
  await handler(newInstallation);

  const offtopicChannels = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
    })
    .promise();

  expect(offtopicChannels.Count).toBe(1);
  expect(offtopicChannels.Items[0]).toEqual(
    expect.objectContaining({
      createdAt: expect.any(String),
      channelId: expect.any(String),
      teamId: expect.any(String),
      updatedAt: expect.any(String),
    })
  );
});
