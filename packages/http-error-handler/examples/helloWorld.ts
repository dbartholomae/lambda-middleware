import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import createHttpError from "http-errors";
import { errorHandler } from "../";

// This is your AWS handler
async function helloWorld(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.search == null) {
    // If you throw an error with status code, the error will be returned as stringified JSON
    // Only the stack will be omitted.
    throw createHttpError(400, "Query has to include a search");
  }

  // If you throw an error with no status code, only a generic message will be shown to the user
  // instead of the full error
  throw new Error("Search is not implemented yet");
}

// Wrap the handler with the middleware
export const handler = errorHandler()(helloWorld);
