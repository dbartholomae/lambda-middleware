import { Context } from "aws-lambda";
import { createContext } from ".";

describe("createContext", () => {
  it("returns a valid context", () => {
    const context: Context = createContext();
    expect(context).toBeDefined();
  });
});
