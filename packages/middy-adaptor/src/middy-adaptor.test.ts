import { middyAdaptor } from "./middy-adaptor";
import { Instance, MiddlewareObject } from "./interfaces/MiddyTypes";

describe("middyAdaptor", () => {
  describe("with an empty middleware", () => {
    let middyMiddleware: MiddlewareObject<any, any>;

    beforeEach(() => {
      middyMiddleware = {};
    });

    it("returns the handler's response", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      const handler = jest.fn().mockResolvedValue(response);
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toMatchObject(response);
    });

    it("throws the error thrown by the handler", async () => {
      const handler = jest.fn().mockRejectedValue(new Error("handler error"));
      await expect(
        middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).rejects.toMatchObject({
        message: "handler error",
      });
    });
  });

  describe("with promise-based middleware", () => {
    let middyMiddleware: MiddlewareObject<any, any>;

    beforeEach(() => {
      middyMiddleware = {
        before: jest.fn().mockResolvedValue(undefined),
        after: jest.fn().mockResolvedValue(undefined),
        onError: jest.fn().mockResolvedValue(undefined),
      };
    });

    it("returns the handler's response", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      const handler = jest.fn().mockResolvedValue(response);
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toMatchObject(response);
    });

    it("carries changes from the before-middleware to the event to the handler", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      middyMiddleware.before = async (instance: Instance) => {
        instance.event.customProperty = "set";
      };
      const handler = jest.fn().mockResolvedValue(response);
      await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          customProperty: "set",
        }),
        expect.anything()
      );
    });

    it("does not carry changes from the after-middleware to the event to the handler", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      middyMiddleware.after = async (instance: Instance) => {
        instance.event.customProperty = "set";
      };
      const handler = async (event: any) => {
        expect(event).not.toMatchObject({
          customProperty: "set",
        });
        return response;
      };
      await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any);
    });

    it("carries changes from the after-middleware to the response", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      middyMiddleware.after = async (instance: Instance) => {
        instance.response.statusCode = 204;
      };
      const handler = jest.fn().mockResolvedValue(response);
      const middlewareResponse = await middyAdaptor(middyMiddleware)(handler)(
        {} as any,
        {} as any
      );
      expect(middlewareResponse.statusCode).toEqual(204);
    });

    it("throws the error returned by onError middleware", async () => {
      middyMiddleware.onError = async (instance: Instance) => {
        return new Error("onError error");
      };
      const handler = jest.fn().mockRejectedValue(new Error("handler error"));
      await expect(
        middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).rejects.toMatchObject({
        message: "onError error",
      });
    });

    it("does not throw an error if onError middleware does not throw", async () => {
      middyMiddleware.onError = async (instance: Instance) => {
        instance.response = "response";
      };
      const handler = jest.fn().mockRejectedValue(new Error("handler error"));
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toEqual("response");
    });

    it("if before middleware calls the callback, handler is not executed", async () => {
      middyMiddleware.before = async (instance: Instance) => {
        instance.callback(null, "response");
      };
      const handler = jest.fn().mockResolvedValue("response");
      await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any);
      expect(handler).not.toHaveBeenCalled();
    });

    it("if before middleware calls the callback with a response, the response is returned", async () => {
      middyMiddleware.before = async (instance: Instance) => {
        instance.callback(null, "response");
      };
      const handler = jest.fn();
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toEqual("response");
    });

    it("if before middleware calls the callback with an error, the error is thrown", async () => {
      middyMiddleware.before = async (instance: Instance) => {
        instance.callback(new Error("Callback error"));
      };
      const handler = jest.fn().mockResolvedValue("response");
      await expect(
        middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).rejects.toMatchObject({
        message: "Callback error",
      });
    });

    it("if after middleware calls the callback with a response, the response is returned", async () => {
      middyMiddleware.after = async (instance: Instance) => {
        instance.callback(null, "response");
      };
      const handler = jest.fn().mockResolvedValue("response");
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toEqual("response");
    });

    it("if after middleware calls the callback with an error, the error is thrown", async () => {
      middyMiddleware.after = async (instance: Instance) => {
        instance.callback(new Error("Callback error"));
      };
      const handler = jest.fn().mockResolvedValue("response");
      await expect(
        middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).rejects.toMatchObject({
        message: "Callback error",
      });
    });
  });

  describe("with a callback-based middleware", () => {
    let middyMiddleware: MiddlewareObject<any, any>;

    beforeEach(() => {
      middyMiddleware = {
        before: (instance, next) => next(),
        after: (instance, next) => next(),
        onError: (instance, next) => next(instance.error),
      };
    });

    it("returns the handler's response", async () => {
      const response = {
        statusCode: 200,
        body: "",
      };
      const handler = jest.fn().mockResolvedValue(response);
      expect(
        await middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).toMatchObject(response);
    });

    it("throws the error returned by onError middleware", async () => {
      middyMiddleware.onError = (instance: Instance, next) => {
        next(new Error("onError error"));
      };
      const handler = jest.fn().mockRejectedValue(new Error("handler error"));
      await expect(
        middyAdaptor(middyMiddleware)(handler)({} as any, {} as any)
      ).rejects.toMatchObject({
        message: "onError error",
      });
    });
  });
});
