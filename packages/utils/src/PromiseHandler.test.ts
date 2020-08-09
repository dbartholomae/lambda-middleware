import { PromiseHandler } from ".";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

describe("PromiseHandler", () => {
  it("accepts a valid handler", () => {
    const handler: PromiseHandler<
      APIGatewayProxyEvent,
      APIGatewayProxyResult
    > = async (event, context) => {
      return {
        statusCode: 200,
        body: "",
      };
    };

    expect(handler).toBeDefined();
  });
});
