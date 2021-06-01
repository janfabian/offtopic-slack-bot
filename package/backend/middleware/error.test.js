import { jest } from "@jest/globals";
import createHttpError from "http-errors";
import error from "./error";

const errorMiddleware = error();
test("no error", () => {
  const next = jest.fn();
  const ctx = {};

  errorMiddleware(ctx, next);

  expect(next.mock.calls.length).toBe(1);
});

test("generic error", () => {
  const message = "test error";
  const next = jest.fn(() => {
    throw new Error(message);
  });
  const ctx = {};

  errorMiddleware(ctx, next);

  expect(next.mock.calls.length).toBe(1);
  expect(ctx).toEqual(
    expect.objectContaining({
      status: 500,
      body: { message },
    })
  );
});

test("http error", () => {
  const message = "403 forbidden";
  const status = 403;
  const next = jest.fn(() => {
    throw createHttpError(status, message);
  });
  const ctx = {};

  errorMiddleware(ctx, next);

  expect(next.mock.calls.length).toBe(1);
  expect(ctx).toEqual(
    expect.objectContaining({
      status: status,
      body: { message },
    })
  );
});
