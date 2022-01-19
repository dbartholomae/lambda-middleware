import { createEvent, createContext } from "@lambda-middleware/utils";
import { ieNoOpen } from "./ieNoOpen";

describe("ieNoOpen", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(
      await ieNoOpen()(handler)(createEvent({}), createContext())
    ).toMatchObject(response);
  });

  it("sets the X-Content-Type-Options header to nosniff", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(
      await ieNoOpen()(handler)(createEvent({}), createContext())
    ).toMatchObject({
      headers: {
        "X-Download-Options": "noopen",
      },
    });
  });
});
