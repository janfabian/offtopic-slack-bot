const nock = require("nock");
const request = require("supertest");
const app = require("../app.js");
const { code } = require("./install.sample.js");

test("install missing code", async () => {
  const response = await request(app.callback()).get("/install");
  expect(response.status).toBe(422);
});

test("install", async () => {
  nock.load("./api/nocks/install.01.json");

  const response = await request(app.callback()).get("/install").query({
    code,
  });
  expect(response.status).toBe(200);
});
