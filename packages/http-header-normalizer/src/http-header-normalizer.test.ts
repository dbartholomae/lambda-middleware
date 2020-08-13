import { httpHeaderNormalizer } from "./http-header-normalizer";
import { createContext, createEvent } from "@lambda-middleware/utils";

describe("http-header-normalizer", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(
      await httpHeaderNormalizer()(handler)(createEvent({}), createContext())
    ).toMatchObject(response);
  });

  it("calls the handler with added lower-cased headers", async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const event = createEvent({
      headers: {
        "Custom-Header": "Custom value",
      },
    });
    await httpHeaderNormalizer()(handler)(event, createContext());
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "custom-header": "Custom value",
        }),
      }),
      expect.anything()
    );
  });

  it("calls the handler with the original headers in rawHeaders", async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const event = createEvent({
      headers: {
        "Custom-Header": "Custom value",
      },
    });
    await httpHeaderNormalizer()(handler)(event, createContext());
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        rawHeaders: expect.objectContaining({
          "Custom-Header": "Custom value",
        }),
      }),
      expect.anything()
    );
  });

  describe("referer", () => {
    it("if referer is set it calls the handler with referrer set to the same value", async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      const event = createEvent({
        headers: {
          referer: "Custom value",
        },
      });
      await httpHeaderNormalizer()(handler)(event, createContext());
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            referrer: "Custom value",
          }),
        }),
        expect.anything()
      );
    });

    it("if referrer is set it calls the handler with referer set to the same value", async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      const event = createEvent({
        headers: {
          referrer: "Custom value",
        },
      });
      await httpHeaderNormalizer()(handler)(event, createContext());
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            referer: "Custom value",
          }),
        }),
        expect.anything()
      );
    });

    it("if referer and referrer are set it calls the handler with the old values", async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      const event = createEvent({
        headers: {
          referer: "Custom value",
          referrer: "Other custom value",
        },
      });
      await httpHeaderNormalizer()(handler)(event, createContext());
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            referer: "Custom value",
            referrer: "Other custom value",
          }),
        }),
        expect.anything()
      );
    });
  });
});
