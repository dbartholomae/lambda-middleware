import createHttpError from "http-errors";
import {
  ErrorWithStatusCode,
  isErrorWithStatusCode,
} from "./ErrorWithStatusCode";

describe("ErrorWithStatusCode", () => {
  describe("interface", () => {
    it("accepts a valid error with status code", () => {
      const error: ErrorWithStatusCode = createHttpError(400, "Oh no");
      expect(error).toBeDefined();
    });
  });

  describe("type guard", () => {
    it("validates a valid error with status code", () => {
      const error = createHttpError(400, "Oh no");
      expect(isErrorWithStatusCode(error)).toBe(true);
    });

    it("rejects an error without status code", () => {
      const error = new Error("Oh no");
      expect(isErrorWithStatusCode(error)).toBe(false);
    });
  });
});
