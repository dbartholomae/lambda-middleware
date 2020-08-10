import { classValidator } from "./classValidator";

import { IsString, IsOptional } from "class-validator";

class NameBody {
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
        classType: NameBody,
      })(handler)({ body }, {} as any);
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

    it("sets the body to the transformed and validated value", async () => {
      const handler = jest.fn();
      await classValidator({
        classType: NameBody,
      })(handler)({ body }, {} as any);
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
        classValidator({
          classType: NameBody,
        })(handler)({ body }, {} as any)
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
          classType: NameBody,
        })(handler)({ body }, {} as any)
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
        classType: OptionalNameBody,
      })(handler)({ body }, {} as any);
      expect(actualResponse).toEqual(expectedResponse);
    });
  });
});
