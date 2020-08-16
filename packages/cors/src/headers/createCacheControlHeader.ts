import { HashMap } from "../interfaces/HashMap";
import { logger } from "../logger";

export function createCacheControlHeader(
  cacheControl: string | null
): HashMap<string> {
  logger("Checking whether to add cacheControl header");
  if (cacheControl === null) {
    logger("Not setting Cache-Control header");
    return {};
  }
  logger(`Setting Cache-Control header to ${cacheControl}`);
  return { "Cache-Control": cacheControl };
}
