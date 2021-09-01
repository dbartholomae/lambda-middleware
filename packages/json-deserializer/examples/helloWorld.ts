import { jsonDeserializer } from "../";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "../lib/types/APIGatewayProxyObjectEvent";

// This is your AWS handler
async function helloWorld(
  request: APIGatewayProxyObjectEvent<APIGatewayProxyEvent>
): Promise<APIGatewayProxyResult> {
  const { bodyObject } = request ?? {};

  if (!bodyObject || typeof bodyObject !== "object") {
    throw new Error("We didn't receive an object! - what happened!?");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ...bodyObject, additionalThing: "addedInHandler" }),
  };
}

// Wrap the handler with the middleware
export const handler = jsonDeserializer()(helloWorld);
