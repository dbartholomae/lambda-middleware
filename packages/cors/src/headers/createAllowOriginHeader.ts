import { HashMap } from "../interfaces/HashMap";
import { isString } from "../type-guards";
import { logger } from "../logger";

function matches(str: string) {
  return function (match: string | RegExp): boolean {
    if (isString(match)) {
      return match === str;
    }
    return match.test(str);
  };
}

function originMatches(
  origin: string,
  allowedOrigins: (string | RegExp)[]
): boolean {
  return allowedOrigins.some(matches(origin));
}

export function createAllowOriginHeader(
  headers: HashMap<string>,
  allowedOrigins: (string | RegExp)[]
): HashMap<string> {
  logger("Checking for allowed origins");
  if (allowedOrigins.length === 0) {
    logger("No allowed origins set, setting wildcard *");
    return { "Access-Control-Allow-Origin": "*" };
  }

  const origin = (headers.Origin ?? headers.origin)?.toString();
  if (originMatches(origin, allowedOrigins)) {
    logger(`Origin matches, setting header to ${origin}`);
    return { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
  }
  logger("Origin does not match any allowed origin, not setting header");
  return { Vary: "Origin" };
}
