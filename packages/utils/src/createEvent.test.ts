import { APIGatewayProxyEvent } from "aws-lambda";
import { createEvent } from ".";

describe("createEvent", () => {
  it("returns a valid context", () => {
    const event: APIGatewayProxyEvent = createEvent({});
    expect(event).toBeDefined();
  });
});
