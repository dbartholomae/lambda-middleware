import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { createAllowCredentialsHeader } from "./headers/createAllowCredentialsHeader";
import { createAllowHeadersHeader } from "./headers/createAllowHeadersHeader";
import { createAllowMethodsHeader } from "./headers/createAllowMethodsHeader";
import { createAllowOriginHeader } from "./headers/createAllowOriginHeader";
import { createCacheControlHeader } from "./headers/createCacheControlHeader";
import { createExposeHeadersHeader } from "./headers/createExposeHeadersHeader";
import { CorsMiddlewareOptions } from "./interfaces/CorsMiddlewareOptions";
import { logger } from "./logger";
import { mergeHeaders } from "./mergeHeaders";

export async function handlePreflightRequest(
  handler: () => Promise<APIGatewayProxyResult>,
  event: {
    headers: APIGatewayEvent["headers"];
  },
  options: Required<CorsMiddlewareOptions>
): Promise<APIGatewayProxyResult> {
  logger("Handle pre-flight request");
  const response = options.preflightContinue
    ? await handler()
    : {
        body: "",
        headers: {
          "Content-Length": "0",
        },
        statusCode: options.optionsSuccessStatus,
      };

  return {
    ...response,
    headers: mergeHeaders(
      createAllowMethodsHeader(options.allowedMethods),
      createAllowHeadersHeader(event.headers, options.allowedHeaders),
      createCacheControlHeader(options.cacheControl),
      createAllowCredentialsHeader(options.allowCredentials),
      createExposeHeadersHeader(options.exposedHeaders),
      createAllowOriginHeader(event.headers, options.allowedOrigins),
      response.headers ?? {}
    ),
  };
}
