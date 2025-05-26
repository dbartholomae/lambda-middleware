import { PromiseHandler } from "@lambda-middleware/utils";
import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import {
  CorsMiddlewareOptions,
  isCorsMiddlewareOptions,
} from "./interfaces/CorsMiddlewareOptions";
import { handlePreflightRequest } from "./handlePreflightRequest";
import { handleNonPreflightRequest } from "./handleNonPreflightRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda/trigger/api-gateway-proxy";
import { isAPIGatewayProxyEvent } from "./type-guards/isAPIGatewayProxyEvent";

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
    Event extends APIGatewayEvent | APIGatewayProxyEventV2,
    Result extends Event extends APIGatewayEvent
      ? APIGatewayProxyResult
      : APIGatewayProxyResultV2
  >(
    handler: PromiseHandler<Event, Result>
  ) => async (event: Event, context: Context): Promise<Result> => {
    const runHandler = () => handler(event, context);

    if (isAPIGatewayProxyEvent(event)) {
      if (event.httpMethod.toLowerCase() === "options") {
        return (handlePreflightRequest(
          runHandler as () => Promise<APIGatewayProxyResult>,
          event,
          fullOptions
        ) as unknown) as Result;
      }
      return (handleNonPreflightRequest(
        runHandler as () => Promise<APIGatewayProxyResult>,
        event,
        fullOptions
      ) as unknown) as Result;
    }
    throw new Error("Event is not an API Gateway Proxy Event");
  };
};
