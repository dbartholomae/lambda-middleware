import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { JSONObject } from "./types/JSONObject";

const logger: IDebugger = debugFactory("@lambda-middleware/json-serializer");

export const jsonSerializer = () => (
  handler: PromiseHandler<APIGatewayEvent, JSONObject | undefined>
) => async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logger("Running handler");
  const response = await handler(event, context);
  logger("Response received");
  if (response === undefined) {
    logger("Undefined response, returning statusCode 204");
    return {
      statusCode: 204,
      body: "",
    };
  }
  logger("Response is not undefined, returning response and statusCode 200");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};
