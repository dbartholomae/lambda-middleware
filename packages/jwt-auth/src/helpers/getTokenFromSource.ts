import { APIGatewayEvent } from "aws-lambda";
import { AuthOptions } from "../interfaces/AuthOptions";
import { logger } from "../logger";

export function getTokenFromSource(
  event: APIGatewayEvent,
  options: Pick<AuthOptions, "tokenSource">
): string | undefined {
  logger("Checking whether event contains token based on given tokenSource");
  try {
    return options.tokenSource && options.tokenSource(event);
  } catch (err) {
    return undefined;
  }
}
