import { createContext, createEvent } from "@lambda-middleware/utils";
import { APIGatewayEvent } from "aws-lambda";
import { Type, Static } from "@sinclair/typebox";
import { typeboxValidator } from "./typeboxValidator";

const NameBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
});

type NameBody = Static<typeof NameBodySchema>;

describe("typeboxValidator", () => {
  describe("with valid input", () => {
    const body = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
    });

    it("sets the body to the validated value", async () => {
      const handler = jest.fn();
      await typeboxValidator(NameBodySchema)(handler)(
        createEvent({ body }),
        createContext()
      );
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

  describe("with superfluous input", () => {
    const body = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
      injection: "malicious",
    });

    it("omits the superfluous input", async () => {
      const handler = jest.fn();
      await typeboxValidator(NameBodySchema)(handler)(
        createEvent({ body }),
        createContext()
      );
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

  describe("with invalid input", () => {
    const body = JSON.stringify({
      firstName: "John",
    });

    it("throws an error with statusCode 400", async () => {
      const handler = jest.fn();
      await expect(
        typeboxValidator(NameBodySchema)(handler)(
          createEvent({ body }),
          createContext()
        )
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe("with null input", () => {
    const body = null;

    it("throws an error with statusCode 400", async () => {
      const handler = jest.fn();
      await expect(
        typeboxValidator(NameBodySchema)(handler)(
          createEvent({ body }),
          createContext()
        )
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe("with an empty body and optional validation", () => {
    const body = "";

    const OptionalNameBodySchema = Type.Object({
      firstName: Type.Optional(Type.String()),
      lastName: Type.Optional(Type.String()),
    });

    type OptionalNameBody = Static<typeof OptionalNameBodySchema>;

    it("returns the handler's response", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "Done",
      };
      const handler = jest.fn().mockResolvedValue(expectedResponse);
      const actualResponse = await typeboxValidator(OptionalNameBodySchema)(
        handler
      )(createEvent({ body }), createContext());
      expect(actualResponse).toEqual(expectedResponse);
    });
  });
});
