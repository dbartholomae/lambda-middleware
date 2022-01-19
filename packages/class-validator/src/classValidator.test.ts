import { classValidator } from "./classValidator";

import { IsOptional, IsString } from "class-validator";
import { createContext, createEvent } from "@lambda-middleware/utils";

class NameBody {
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

describe("classValidator", () => {
  describe("with valid input", () => {
    const body = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
    });

    it("sets the body to the transformed and validated value", async () => {
      const handler = jest.fn();
      await classValidator({
        bodyType: NameBody,
      })(handler)(createEvent({ body }), createContext());
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

    it("with excludeExtraneousValues throws an error", async () => {
      const handler = jest.fn();
      await expect(
        classValidator({
          bodyType: NameBody,
          transformer: {
            excludeExtraneousValues: true,
          },
        })(handler)(createEvent({ body }), createContext())
      ).rejects.toBeDefined();
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
      await classValidator({
        bodyType: NameBody,
      })(handler)(createEvent({ body }), createContext());
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

    it("without whitelisting returns the handler's response", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "Done",
      };
      const handler = jest.fn().mockResolvedValue(expectedResponse);
      const actualResponse = await classValidator({
        bodyType: NameBody,
        validator: {
          whitelist: false,
        },
      })(handler)(createEvent({ body }), createContext());
      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe("with invalid input", () => {
    const body = JSON.stringify({
      firstName: "John",
    });

    it("throws an error with statusCode 400", async () => {
      const handler = jest.fn();
      await expect(
        classValidator({
          bodyType: NameBody,
        })(handler)(createEvent({ body }), createContext())
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
        classValidator({
          bodyType: NameBody,
        })(handler)(createEvent({ body }), createContext())
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe("with an empty body and optional validation", () => {
    const body = "";

    class OptionalNameBody {
      @IsOptional()
      @IsString()
      public firstName?: string;

      @IsOptional()
      @IsString()
      public lastName?: string;
    }

    it("returns the handler's response", async () => {
      const expectedResponse = {
        statusCode: 200,
        body: "Done",
      };
      const handler = jest.fn().mockResolvedValue(expectedResponse);
      const actualResponse = await classValidator({
        bodyType: OptionalNameBody,
      })(handler)(createEvent({ body }), createContext());
      expect(actualResponse).toEqual(expectedResponse);
    });
  });
});
