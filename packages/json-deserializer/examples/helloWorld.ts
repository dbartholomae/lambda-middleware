import { jsonDeserializer } from "../";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "../lib/types/APIGatewayProxyObjectEvent";

// This is your AWS handler
async function helloWorld(
  request: APIGatewayProxyObjectEvent<APIGatewayProxyEvent>
): Promise<APIGatewayProxyResult> {
  const { body: originalBody } = request ?? {};

  if (!originalBody || typeof originalBody !== "object") {
    throw new Error("We didn't receive an object! - what happened!?");
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      Object.assign({}, originalBody, {
        additionalThing: "addedInHandler",
      })
    ),
  };
}

// Wrap the handler with the middleware
export const handler = jsonDeserializer()(helloWorld);
