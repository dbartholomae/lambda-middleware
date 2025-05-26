import { APIGatewayProxyEventV2 } from "aws-lambda";
import { createEventV2 } from ".";

describe("createEventV2", () => {
  it("returns a valid event", () => {
    const event: APIGatewayProxyEventV2 = createEventV2({});
    expect(event).toBeDefined();
  });
});
