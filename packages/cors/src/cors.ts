import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import {
  CorsMiddlewareOptions,
  isCorsMiddlewareOptions,
} from "./interfaces/CorsMiddlewareOptions";
import { handlePreflightRequest } from "./handlePreflightRequest";
import { handleNonPreflightRequest } from "./handleNonPreflightRequest";

export const cors = (options: CorsMiddlewareOptions = {}) => {
  if (!isCorsMiddlewareOptions(options)) {
    throw new TypeError(
      `Received invalid options object ${JSON.stringify(options, null, 2)}`
    );
  }

  const fullOptions: Required<CorsMiddlewareOptions> = {
    allowedHeaders: null,
    cacheControl: null,
    allowCredentials: false,
    exposedHeaders: [],
    maxAge: null,
    allowedMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    optionsSuccessStatus: 204,
    allowedOrigins: [],
    preflightContinue: false,
    ...options,
  };

  return <
    Event extends {
      headers: APIGatewayEvent["headers"];
      httpMethod: APIGatewayEvent["httpMethod"];
    }
  >(
    handler: PromiseHandler<Event, APIGatewayProxyResult>
  ) => async (
    event: Event,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const runHandler = () => handler(event, context);

    if (event.httpMethod.toLowerCase() === "options") {
      return handlePreflightRequest(runHandler, event, fullOptions);
    }
    return handleNonPreflightRequest(runHandler, event, fullOptions);
  };
};
