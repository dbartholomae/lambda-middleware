import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import { logger } from "./logger";

export const http-header-normalizer = <E>() => (
  handler: PromiseHandler<E, APIGatewayProxyResult>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
  logger("Running handler");
  const response = await handler(event, context);
  return response;
};
