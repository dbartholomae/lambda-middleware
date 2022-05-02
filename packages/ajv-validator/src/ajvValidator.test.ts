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
  const givenBody = JSON.stringify({
    firstName: "John",
    lastName: "Doe",
  });
  const expectedBody: NameBody = {
    firstName: "John",
    lastName: "Doe",
  };

  describe("given valid input", () => {
    it("sets the body to the transformed and validated value successfully", async () => {
      const handler = jest.fn();

      // when
      await ajvValidator({
        ajv: { schema },
      })(handler)(createEvent({ body: givenBody }), createContext());

      // then
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expectedBody,
        }),
        expect.anything()
      );
    });
  });

  describe("given superfluous input", () => {
    it.each([
      {
        firstName: "John",
        lastName: "Doe",
        injection: "malicious",
      },
      {
        firstName: "John",
        lastName: "Doe",
        injection: 10,
      },
      {
        firstName: "John",
        lastName: "Doe",
        injection: { firstName: "malicious" },
      },
      {
        firstName: "John",
        lastName: "Doe",
        injection: [],
      },
    ])(
      "%p validator omits the superfluous inputs successfully",
      async (givenBody) => {
        const handler = jest.fn();

        // when
        await ajvValidator({
          ajv: { schema },
        })(handler)(
          createEvent({ body: JSON.stringify(givenBody) }),
          createContext()
        );

        // then
        expect(handler).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expectedBody,
          }),
          expect.anything()
        );
      }
    );
  });
});
