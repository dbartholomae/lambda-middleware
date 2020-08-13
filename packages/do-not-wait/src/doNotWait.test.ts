import { doNotWait } from "./doNotWait";
import { createContext, createEvent } from "@lambda-middleware/utils";

describe("doNotWait", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(await doNotWait()(handler)({} as any, {} as any)).toMatchObject(
      response
    );
  });

  it("sets callbackWaitsForEmptyEventLoop to false", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    const context = createContext();
    await doNotWait()(handler)(createEvent({}), context);
    expect(context.callbackWaitsForEmptyEventLoop).toBe(false);
  });
});
