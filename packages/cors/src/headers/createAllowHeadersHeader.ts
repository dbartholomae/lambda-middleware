import { HashMap } from "../interfaces/HashMap";
import { logger } from "../logger";

export function createAllowHeadersHeader(
  headers: HashMap<string>,
  allowedHeaders: string[] | null
): HashMap<string> {
  logger("Checking if allowedHeaders is set");
  if (allowedHeaders) {
    logger("allowedHeaders is set, setting header to it");
    return {
      "Access-Control-Allow-Headers": allowedHeaders.join(","),
    };
  }
  const value =
    headers["Access-Control-Request-Headers"] ??
    headers["access-control-request-headers"];
  logger(
    `allowedHeaders is not set, reading incoming header and setting header to ${value}`
  );
  return {
    "Access-Control-Allow-Headers": value,
    Vary: "Access-Control-Request-Headers",
  };
}
