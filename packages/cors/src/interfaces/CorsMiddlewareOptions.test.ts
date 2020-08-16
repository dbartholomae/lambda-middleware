import {
  CorsMiddlewareOptions,
  isCorsMiddlewareOptions,
} from "./CorsMiddlewareOptions";

describe("CorsMiddlewareOptions", () => {
  const fullOptions: CorsMiddlewareOptions = {
    allowedHeaders: ["X-Custom-Header"],
    cacheControl: "max-age=300",
    allowCredentials: true,
    exposedHeaders: ["X-Custom-Header"],
    maxAge: 1000,
    allowedMethods: ["POST", "DELETE"],
    optionsSuccessStatus: 200,
    allowedOrigins: ["https://example.com"],
    preflightContinue: true,
  };

  describe("interface", () => {
    it("accepts a full configuration", async () => {
      expect(fullOptions).toBeDefined();
    });

    it("accepts a minimal configuration", async () => {
      const options: CorsMiddlewareOptions = {};
      expect(options).toBeDefined();
    });
  });

  describe("isCorsMiddlewareOptions", () => {
    it("accepts full options", () => {
      expect(isCorsMiddlewareOptions(fullOptions)).toBe(true);
    });

    it("accepts minimal options", () => {
      expect(isCorsMiddlewareOptions({})).toBe(true);
    });

    it("rejects allowedHeaders that is null", () => {
      expect(isCorsMiddlewareOptions(null)).toBe(false);
    });

    it("rejects allowedHeaders that is not an array", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowedHeaders: {} })
      ).toBe(false);
    });

    it("rejects allowedHeaders that contains a non-string", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowedHeaders: [{}] })
      ).toBe(false);
    });

    it("allowr allowedHeaders that are null", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowedHeaders: null })
      ).toBe(true);
    });

    it("rejects allowCredentials that is non-boolean", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowCredentials: {} })
      ).toBe(false);
    });

    it("rejects exposedHeaders that contains a non-string", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, exposedHeaders: [{}] })
      ).toBe(false);
    });

    it("rejects allowedMethods that contains a non-string", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowedMethods: [{}] })
      ).toBe(false);
    });

    it("rejects maxAge that is not a number", () => {
      expect(isCorsMiddlewareOptions({ ...fullOptions, maxAge: {} })).toBe(
        false
      );
    });

    it("accepts maxAge that is null", () => {
      expect(isCorsMiddlewareOptions({ ...fullOptions, maxAge: null })).toBe(
        true
      );
    });

    it("rejects optionsSuccessStatus that is not a number", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, optionsSuccessStatus: {} })
      ).toBe(false);
    });

    it("rejects allowedOrigins that contains a non-string", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, allowedOrigins: [{}] })
      ).toBe(false);
    });

    it("allows allowedOrigins that contain a RegExp", () => {
      expect(
        isCorsMiddlewareOptions({
          ...fullOptions,
          allowedOrigins: ["", /test/],
        })
      ).toBe(true);
    });

    it("rejects preflightContinue that is non-boolean", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, preflightContinue: {} })
      ).toBe(false);
    });

    it("rejects cacheControl that is non-string", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, cacheControl: {} })
      ).toBe(false);
    });

    it("accepts cacheControl that is null", () => {
      expect(
        isCorsMiddlewareOptions({ ...fullOptions, cacheControl: null })
      ).toBe(true);
    });
  });
});
