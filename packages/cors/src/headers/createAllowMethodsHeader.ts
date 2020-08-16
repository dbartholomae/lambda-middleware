import { HashMap } from "../interfaces/HashMap";
import { logger } from "../logger";

export function createAllowMethodsHeader(
  allowedMethods: string[]
): HashMap<string> {
  const value = allowedMethods.join(",");
  logger(`Adding Access-Control-Allow-Headers header with value ${value}`);
  return {
    "Access-Control-Allow-Methods": value,
  };
}
