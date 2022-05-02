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
  const validBodyJSON = JSON.stringify({
    firstName: "John",
    lastName: "Doe",
  });
  const validBody: NameBody = {
    firstName: "John",
    lastName: "Doe",
  };

  describe("given valid input", () => {
    it("sets the body to the transformed and validated value successfully", async () => {
      const handler = jest.fn();

      // when
      await ajvValidator({
        ajv: { schema },
      })(handler)(createEvent({ body: validBodyJSON }), createContext());

      // then
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: validBody,
        }),
        expect.anything()
      );
    });

    it("changes ajv configuration with given inputs successfully", async () => {
      const handler = jest.fn();

      // when
      await ajvValidator({
        ajv: { schema, options: { allErrors: true } },
      })(handler)(createEvent({ body: validBodyJSON }), createContext());

      // then
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: validBody,
        }),
        expect.anything()
      );
    })
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
            body: validBody,
          }),
          expect.anything()
        );
      }
    );
  });

  describe("given invalid input", () => {
    it("throws an error with statusCode 400", async () => {
      const invalidBody = {
        foo: "",
        bar: 1,
      };
      const handler = jest.fn();

      // then
      expect(
        ajvValidator({ ajv: { schema } })(handler)(
          createEvent({ body: JSON.stringify(invalidBody) }),
          createContext()
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "must have required property 'firstName'"
      });
    });
  });

  describe.each([undefined, null, "{}"])("given %p input", (input) => {
    it("throws an error with statusCode 400", async () => {
      const handler = jest.fn();

      // then
      expect(
        ajvValidator({ ajv: { schema } })(handler)(
          createEvent({ body: input }),
          createContext()
        )
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe("with an empty body and optional properties", () => {
    class OptionalNameBody {
      constructor(
        public readonly firstName?: string,
        public readonly lastName?: string
      ) {}
    }
    const optionalsSchema: JSONSchemaType<OptionalNameBody> = {
      type: "object",
      properties: {
        firstName: { type: "string", nullable: true },
        lastName: { type: "string", nullable: true },
      },
      additionalProperties: false,
    };

    it("returns the handler's response", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "Done",
      };
      const handler = jest.fn().mockResolvedValue(expectedResponse);

      // when
      const actualResponse = await ajvValidator({
        ajv: { schema: optionalsSchema },
      })(handler)(createEvent({ body: "" }), createContext());

      // then
      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe("when handler throws error", () => {
    it("returns 400 error promise rejection successfully", async () => {
      const handler = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      // then
      expect(
        ajvValidator({ ajv: { schema } })(handler)(
          createEvent({ body: validBodyJSON }),
          createContext()
        )
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });
});
