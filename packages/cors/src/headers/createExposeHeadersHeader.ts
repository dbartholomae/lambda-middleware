import { HashMap } from "../interfaces/HashMap";
import { logger } from "../logger";

export function createExposeHeadersHeader(
  exposedHeaders: string[]
): HashMap<string> {
  logger("Checking whether to set exposed headers header");
  if (exposedHeaders.length === 0) {
    logger("No exposed headers, not setting header");
    return {};
  }
  logger("Setting Access-Control-Expose-Headers header");
  return { "Access-Control-Expose-Headers": exposedHeaders.join(",") };
}
