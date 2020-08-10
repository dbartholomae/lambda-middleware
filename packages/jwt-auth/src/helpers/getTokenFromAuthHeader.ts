import { APIGatewayEvent } from "aws-lambda";
import createHttpError from "http-errors";
import { AuthOptions } from "../interfaces/AuthOptions";
import { logger } from "../logger";

function isLowerCaseAuthorizedEvent(
  event: APIGatewayEvent
): event is APIGatewayEvent & { headers: { authorization: string } } {
  return typeof event.headers.authorization === "string";
}

function isUpperCaseAuthorizedEvent(
  event: APIGatewayEvent
): event is APIGatewayEvent & { headers: { Authorization: string } } {
  return typeof event.headers.Authorization === "string";
}

export function getTokenFromAuthHeader<Payload>(
  event: APIGatewayEvent,
  options: Pick<AuthOptions, "credentialsRequired">
): string | undefined {
  logger("Checking whether event contains at least one authorization header");
  if (
    !isLowerCaseAuthorizedEvent(event) &&
    !isUpperCaseAuthorizedEvent(event)
  ) {
    logger("No authorization header found");
    if (options.credentialsRequired) {
      throw createHttpError(
        401,
        "No valid bearer token was set in the authorization header",
        {
          type: "AuthenticationRequired",
        }
      );
    }
    return;
  }

  logger("Checking whether event contains multiple authorization headers");
  if (isLowerCaseAuthorizedEvent(event) && isUpperCaseAuthorizedEvent(event)) {
    logger(
      "Both authorization and Authorization headers found, only one can be set"
    );
    throw createHttpError(
      400,
      "Both authorization and Authorization headers found, only one can be set",
      {
        type: "MultipleAuthorizationHeadersSet",
      }
    );
  }
  logger("One authorization header found");

  logger("Checking whether authorization header is formed correctly");
  const authHeader = isLowerCaseAuthorizedEvent(event)
    ? event.headers.authorization
    : event.headers.Authorization;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    logger(
      `Authorization header malformed, it was "${authHeader}" but should be of format "Bearer token"`
    );
    throw createHttpError(
      401,
      `Format should be "Authorization: Bearer [token]", received "Authorization: ${authHeader}" instead`,
      {
        type: "WrongAuthFormat",
      }
    );
  }
  logger("Authorization header formed correctly");

  return parts[1];
}
