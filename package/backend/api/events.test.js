const request = require("supertest");
const app = require("../app.js");
const { verify, message } = require("./events.sample.js");

test("verification", async () => {
  const response = await request(app.callback()).post("/events").send(verify);
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    challenge: verify.challenge,
  });
});

test("message", async () => {
  const response = await request(app.callback()).post("/events").send(message);
  expect(response.status).toBe(200);
});
