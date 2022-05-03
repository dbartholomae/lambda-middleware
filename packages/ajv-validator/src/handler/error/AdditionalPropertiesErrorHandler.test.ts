import Ajv, { JSONSchemaType } from "ajv";
import { AdditionalPropertiesErrorHandler } from "./AdditionalPropertiesErrorHandler";

class NameBody {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

describe("AJVAdditionalPropertiesErrorHandler", () => {
  const ajv = new Ajv({ allErrors: true });
  const schema: JSONSchemaType<NameBody> = {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string", nullable: true },
    },
    required: ["firstName"],
    additionalProperties: false,
  };
  const expectedBody: NameBody = {
    firstName: "John",
    lastName: "Doe",
  };
  let additionalPropertiesErrorHandler: AdditionalPropertiesErrorHandler<NameBody>;

  beforeEach(() => {
    const validate = ajv.compile(schema);
    additionalPropertiesErrorHandler = new AdditionalPropertiesErrorHandler({
      validate,
    });
  });

  describe("given input with additional properties", () => {
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
    ])("%p omits the superfluous inputs successfully", async (givenBody) => {
      // when
      const actual = additionalPropertiesErrorHandler.handleError(givenBody);

      // then
      expect(actual).toEqual(expectedBody);
    });
  });

  describe("given error does not exists", () => {
    it("returns body without deleting properties", () => {
      jest
        .spyOn(
          additionalPropertiesErrorHandler as any,
          "findAdditionalPropertyError"
        )
        .mockReturnValue(undefined);
      jest
        .spyOn(additionalPropertiesErrorHandler as any, "validate")
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // when
      const actual = additionalPropertiesErrorHandler.handleError({
        firstName: "John",
        lastName: "Doe",
        injection: "malicious",
      } as NameBody);

      // then
      expect(actual).toEqual({
        firstName: "John",
        lastName: "Doe",
        injection: "malicious",
      });
    });

    it("returns body without deleting properties", () => {
      additionalPropertiesErrorHandler['validate']['errors'];
      jest
        .spyOn(additionalPropertiesErrorHandler as any, "validate")
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // when
      const actual = additionalPropertiesErrorHandler.handleError({
        firstName: "John",
        lastName: "Doe",
        injection: "malicious",
      } as NameBody);

      // then
      expect(actual).toEqual({
        firstName: "John",
        lastName: "Doe",
        injection: "malicious",
      });
    });
  });
});