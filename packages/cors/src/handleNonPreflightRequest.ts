import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "./logger";
import { CorsMiddlewareOptions } from "./interfaces/CorsMiddlewareOptions";
import { createAllowOriginHeader } from "./headers/createAllowOriginHeader";
import { createAllowCredentialsHeader } from "./headers/createAllowCredentialsHeader";
import { createExposeHeadersHeader } from "./headers/createExposeHeadersHeader";
import { mergeHeaders } from "./mergeHeaders";

export async function handleNonPreflightRequest(
  handler: () => Promise<APIGatewayProxyResult>,
  event: {
    headers: APIGatewayEvent["headers"];
  },
  options: Required<CorsMiddlewareOptions>
): Promise<APIGatewayProxyResult> {
  logger("Handle non-preflight request");
  logger("Running handler");
  const response = await handler();
  logger("Returning response");
  return {
    ...response,
    headers: mergeHeaders(
      createAllowOriginHeader(event.headers, options.allowedOrigins),
      createAllowCredentialsHeader(options.allowCredentials),
      createExposeHeadersHeader(options.exposedHeaders),
      response.headers ?? {}
    ),
  };
}
