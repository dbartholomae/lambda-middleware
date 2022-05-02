import { ajvValidator } from "./ajvValidator";
import { createEvent, createContext } from "@lambda-middleware/utils";

describe("ajvValidator", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(
      await ajvValidator()(handler)(createEvent({}), createContext())
    ).toMatchObject(response);
  });
});
