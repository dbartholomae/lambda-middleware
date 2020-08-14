import { cors } from "./cors";
import { createEvent, createContext } from "@lambda-middleware/utils";

describe("cors", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(await cors()(handler)(
      createEvent({}), createContext()
    ).toMatchObject(
      response
    );
  });
});
