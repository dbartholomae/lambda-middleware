import { HashMap } from "../interfaces/HashMap";
import { logger } from "../logger";

export function createAllowCredentialsHeader(
  allowCredentials: boolean
): HashMap<string> {
  logger("Adding Access-Control-Allow-Credentials header with value 'true'");
  return allowCredentials ? { "Access-Control-Allow-Credentials": "true" } : {};
}
