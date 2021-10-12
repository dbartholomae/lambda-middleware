import { frameguard } from "./frameguard";
import { createEvent, createContext } from "@lambda-middleware/utils";

describe("frameguard", () => {
  const emptyResponse = {
    statusCode: 200,
    body: "",
  };
  const event = createEvent({});

  it("returns the handler's response", async () => {
    const handler = jest.fn().mockResolvedValue(emptyResponse);

    const response = await frameguard()(handler)(event, createContext());

    expect(response).toMatchObject(emptyResponse);
  });

  it.each([["deny" as const], ["sameorigin" as const]])(
    "sets the X-Frame-Options header according to options",
    async (action) => {
      const handler = jest.fn().mockResolvedValue(emptyResponse);

      const response = await frameguard({ action })(handler)(
        event,
        createContext()
      );

      expect(response).toMatchObject({
        headers: {
          "X-Frame-Options": action,
        },
      });
    }
  );

  it("sets X-Frame-Options to sameorigin by default", async () => {
    const handler = jest.fn().mockResolvedValue(emptyResponse);

    const response = await frameguard()(handler)(event, createContext());

    expect(response).toMatchObject({
      headers: {
        "X-Frame-Options": "sameorigin",
      },
    });
  });
});
