import { jsonSerializer } from "./JsonSerializer";
import { createContext, createEvent } from "@lambda-middleware/utils";

describe("jsonSerializer", () => {
  describe("with a handler returning an empty object", () => {
    let response: any;

    beforeEach(async () => {
      const handler = async () => ({});
      const handlerWithMiddleware = jsonSerializer()(handler);
      response = await handlerWithMiddleware(createEvent({}), createContext());
    });

    it("returns 200", async () => {
      expect(response).toMatchObject({ statusCode: 200 });
    });

    it("returns the stringified JSON response", async () => {
      expect(response.body).toEqual("{}");
    });

    it("sets Content-Type header to application/json", () => {
      expect(response.headers["Content-Type"]).toEqual("application/json");
    });
  });

  describe("with a handler returning undefined", () => {
    let response: any;

    beforeEach(async () => {
      const handler = async () => undefined;
      const handlerWithMiddleware = jsonSerializer()(handler);
      response = await handlerWithMiddleware(createEvent({}), createContext());
    });

    it("returns 204", async () => {
      expect(response).toMatchObject({ statusCode: 204 });
    });

    it("returns an empty string", async () => {
      expect(response.body).toEqual("");
    });
  });

  describe("with a handler returning an object with a circular reference", () => {
    let handlerWithMiddleware: any;

    beforeEach(async () => {
      const returnedObject: any = {};
      returnedObject.foo = returnedObject;
      const handler = () => returnedObject;
      handlerWithMiddleware = jsonSerializer()(handler);
    });

    it("rejects", async () => {
      await expect(handlerWithMiddleware({}, {})).rejects.toBeDefined();
    });
  });

  describe("with a handler returning an object with an undefined properti", () => {
    let handlerWithMiddleware: any;

    beforeEach(async () => {
      const handler = () =>
        Promise.resolve({
          foo: undefined,
        });
      handlerWithMiddleware = jsonSerializer()(handler);
    });

    it("strips out the undefined property", async () => {
      expect((await handlerWithMiddleware({}, {})).body).toEqual("{}");
    });
  });
});
