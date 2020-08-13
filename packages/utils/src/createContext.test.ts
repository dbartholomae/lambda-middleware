import { Context } from "aws-lambda";
import { createContext } from ".";

describe("createContext", () => {
  it("returns a valid context", () => {
    const context: Context = createContext();
    expect(context).toBeDefined();
  });

  it("allows to change callbackWaitsForEmptyEventLoop value", () => {
    const context: Context = createContext({
      callbackWaitsForEmptyEventLoop: false,
    });
    expect(context.callbackWaitsForEmptyEventLoop).toBe(false);
  });
});
