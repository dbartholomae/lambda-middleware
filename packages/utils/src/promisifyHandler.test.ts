import { createContext, promisifyHandler } from ".";

describe("promisifyHandler", () => {
  describe("with a promise-based handler", () => {
    it("returns the value the handler resolves to", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "",
      };
      const handler = async () => expectedResponse;
      const actualResponse = await promisifyHandler(handler)(
        {},
        createContext()
      );
      expect(actualResponse).toEqual(expectedResponse);
    });

    it("throws the error the handler rejects with", async () => {
      const expectedError = new Error("expected error");
      const handler = async () => {
        throw expectedError;
      };
      await expect(
        promisifyHandler(handler)({}, createContext())
      ).rejects.toEqual(expectedError);
    });
  });

  describe("with a callback-based handler", () => {
    it("returns the value the handler calls back with", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "",
      };
      const handler = (_event: any, _context: any, callback: any) => {
        callback(null, expectedResponse);
      };
      const actualResponse = await promisifyHandler(handler)(
        {},
        createContext()
      );
      expect(actualResponse).toEqual(expectedResponse);
    });

    it("throws the error the handler calls back with", async () => {
      const expectedError = new Error("expected error");
      const handler = (_event: any, _context: any, callback: any) => {
        callback(expectedError);
      };
      await expect(
        promisifyHandler(handler)({}, createContext())
      ).rejects.toEqual(expectedError);
    });
  });
});
