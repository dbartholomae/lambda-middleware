import { compose } from "@lambda-middleware/compose";
import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { logger } from "./logger";

function lowercaseKeys(object: Record<string, string>): Record<string, string> {
  const newObject: Record<string, string> = {};
  for (const key in object) {
    newObject[key.toLowerCase()] = object[key];
  }
  return newObject;
}

function addReferrer(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    referrer: headers.referrer ?? headers.referer,
    referer: headers.referer ?? headers.referrer,
  };
}

function normalizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  return compose(addReferrer, lowercaseKeys)(headers);
}

export const httpHeaderNormalizer = <E extends APIGatewayProxyEvent, R>() => (
  handler: PromiseHandler<E & { rawHeaders: Record<string, string> }, R>
) => async (event: E, context: Context): Promise<R> => {
  logger("Running handler");
  const normalizedEvent = {
    ...event,
    headers: normalizeHeaders(event.headers),
    rawHeaders: event.headers,
  };
  return handler(normalizedEvent, context);
};
