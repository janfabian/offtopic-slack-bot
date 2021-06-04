const request = require("supertest");
const { testUmzug } = require("../../database/migrations/umzug.js");
const app = require("../app.js");
const { verify, message } = require("./events.test-cases.js");

test("verification", async () => {
  const response = await request(app.callback()).post("/events").send(verify);
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    challenge: verify.challenge,
  });
});

test("message", async () => {
  console.log(await testUmzug.up());
  const response = await request(app.callback()).post("/events").send(message);
  expect(response.status).toBe(200);
});
