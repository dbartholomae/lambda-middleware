import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import { JSONObject } from "./types/JSONObject";

const logger: IDebugger = debugFactory("@lambda-middleware/json-serializer");

export const jsonSerializer = <E>() => (
  handler: PromiseHandler<E, JSONObject | undefined>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
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
    body: JSON.stringify(response),
  };
};
