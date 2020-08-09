import { APIGatewayEvent } from "aws-lambda";
import debugFactory from "debug";
import { AuthOptions } from "../interfaces/AuthOptions";

const logger = debugFactory("@lambda-middleware/jwt-auth");

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
