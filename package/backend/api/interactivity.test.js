jest.mock("../../lib/slack", () => {
  const originalModule = jest.requireActual("../../lib/slack");

  return {
    ...originalModule,
    createThread: jest.fn(),
  };
});
const slackLib = require("../../lib/slack");

const nock = require("nock");
const request = require("supertest");
const { documentClient } = require("../../database/dynamo.js");
const app = require("../app.js");
const {
  messageAction,
  TEAM_ID,
  MESSAGE_TS,
} = require("./interactivity.sample.js");
const { THREAD_TYPE } = require("../../lib/constants");
const { addAccessToken } = require("../../lib/test/add-access-token-to-db");

const API_ENDPOINT = "/interactivity";

beforeEach(() => addAccessToken(TEAM_ID));

test("interactivity message action", async () => {
  nock.load("./api/nocks/interactivity.01.json");

  const channelId = "mocked-channelId";

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
      Item: {
        teamId: TEAM_ID,
        channelId: channelId,
      },
    })
    .promise();

  slackLib.createThread.mockImplementationOnce(() => ({
    offtopic: {
      header: {
        channel: "mockedResponseOfftopicChannelId",
        ts: "mockedResponseHeaderTs",
      },
      thread: {
        channel: "mockedResponseOfftopicChannelId",
        ts: "mockedResponseThreadTs",
      },
    },
  }));

  const response = await request(app.callback())
    .post(API_ENDPOINT)
    .send(messageAction);

  expect(response.status).toBe(200);
  expect(slackLib.createThread.mock.calls[0][3]).toBe(channelId);

  const d = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_TABLE_THREADS,
    })
    .promise();

  expect(d.Items).toHaveLength(2);
  expect(d.Items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        teamId: expect.any(String),
        messageId: expect.any(String),
        channelId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        threadId: "mockedResponseThreadTs",
        headerId: "mockedResponseHeaderTs",
        type: THREAD_TYPE.ORIGINAL_MESSAGE,
      }),
      expect.objectContaining({
        teamId: expect.any(String),
        messageId: "mockedResponseThreadTs",
        headerId: "mockedResponseHeaderTs",
        channelId: "mockedResponseOfftopicChannelId",
        originalMessageId: expect.any(String),
        originalMessageChannelId: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        type: THREAD_TYPE.OFFTOPIC_MESSAGE,
      }),
    ])
  );
});

test("interactivity message action - offtopic thread already exists", async () => {
  nock.load("./api/nocks/interactivity.01.json");

  const channelId = "mocked-channelId";

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_OFFTOPIC_CHANNELS,
      Item: {
        teamId: TEAM_ID,
        channelId: channelId,
      },
    })
    .promise();

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_TABLE_THREADS,
      Item: {
        teamId: TEAM_ID,
        messageId: MESSAGE_TS,
      },
    })
    .promise();

  slackLib.createThread.mockImplementationOnce(() => null);

  const response = await request(app.callback())
    .post(API_ENDPOINT)
    .send(messageAction);

  expect(response.status).toBe(200);
  expect(slackLib.createThread.mock.calls).toHaveLength(0);
});
