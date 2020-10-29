import { composeHandler } from "./compose-handler";

describe("composeHandler", () => {
  describe("with no arguments", () => {
    it("throws a TypeError if called without any arguments", () => {
      // @ts-expect-error
      expect(() => composeHandler()).toThrow(
        new TypeError("compose requires at least one argument")
      );
    });
  });

  describe("with one arguments", () => {
    it("throws a TypeError if called with only one argument", () => {
      // @ts-expect-error
      expect(() => composeHandler(jest.fn())).toThrow(
        new TypeError("compose requires at least one argument")
      );
    });
  });

  describe("with three arguments", () => {
    it("calls the functions in order", () => {
      const mockHandler = "mockHandler";
      const middlewareAResponse = "middleware-A-response";
      const mockMiddlewareA = jest.fn().mockReturnValue(middlewareAResponse);
      const middlewareBResponse = "middleware-B-response";
      const mockMiddlewareB = jest.fn().mockReturnValue(middlewareBResponse);
      const composeResponse = composeHandler(
        mockMiddlewareB,
        mockMiddlewareA,
        mockHandler
      );

      expect(mockMiddlewareA).toHaveBeenCalledWith(mockHandler);
      expect(mockMiddlewareB).toHaveBeenCalledWith(middlewareAResponse);
      expect(composeResponse).toBe(middlewareBResponse);
    });
  });
});
