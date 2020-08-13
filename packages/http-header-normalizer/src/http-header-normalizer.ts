import { compose } from "@lambda-middleware/compose";
import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { logger } from "./logger";

type HashMap<Value> = { [key: string]: Value };

function lowercaseKeys(object: HashMap<string>): HashMap<string> {
  const newObject = {};
  for (const key in object) {
    newObject[key.toLowerCase()] = object[key];
  }
  return newObject;
}

function addReferrer(headers: HashMap<string>): HashMap<string> {
  return {
    ...headers,
    referrer: headers.referrer ?? headers.referer,
    referer: headers.referer ?? headers.referrer,
  };
}

function normalizeHeaders(headers: HashMap<string>): HashMap<string> {
  return compose(addReferrer, lowercaseKeys)(headers);
}

export const httpHeaderNormalizer = <E extends APIGatewayProxyEvent, R>() => (
  handler: PromiseHandler<E & { rawHeaders: HashMap<string> }, R>
) => async (event: E, context: Context): Promise<R> => {
  logger("Running handler");
  const normalizedEvent = {
    ...event,
    headers: normalizeHeaders(event.headers),
    rawHeaders: event.headers,
  };
  return handler(normalizedEvent, context);
};
