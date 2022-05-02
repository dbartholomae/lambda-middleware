import { createContext, createEvent } from "@lambda-middleware/utils";
import { JSONSchemaType } from "ajv";
import { ajvValidator } from "./ajvValidator";

class NameBody {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

describe("ajvValidator", () => {
  const schema: JSONSchemaType<NameBody> = {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string", nullable: true },
    },
    required: ["firstName"],
    additionalProperties: false,
  };

  describe("given valid input", () => {
    const body = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
    });

    it("sets the body to the transformed and validated value successfully", async () => {
      const handler = jest.fn();

      // when
      await ajvValidator({
        ajv: { schema },
      })(handler)(createEvent({ body }), createContext());

      // then
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            firstName: "John",
            lastName: "Doe",
          },
        }),
        expect.anything()
      );
    });
  });
});
