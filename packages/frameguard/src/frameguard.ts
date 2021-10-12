import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import { FrameguardMiddlewareOptions } from "./interfaces/FrameguardMiddlewareOptions";
import { logger } from "./logger";

export const frameguard = <E>(
  options: FrameguardMiddlewareOptions = { action: "sameorigin" }
) => (handler: PromiseHandler<E, APIGatewayProxyResult>) => async (
  event: E,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logger("Running handler");
  const response = await handler(event, context);
  return {
    ...response,
    headers: { ...response.headers, "X-Frame-Options": options.action },
  };
};
