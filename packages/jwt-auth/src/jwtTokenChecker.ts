import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayEvent, Context } from "aws-lambda";
import debugFactory from "debug";
import jwt, { TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import createHttpError from "http-errors";
import { getTokenFromAuthHeader } from "./helpers/getTokenFromAuthHeader";
import { getTokenFromSource } from "./helpers/getTokenFromSource";
import {
  EncryptionAlgorithms,
  AuthOptions,
  isAuthOptions,
} from "./interfaces/AuthOptions";

const logger = debugFactory("@lambda-middleware/jwt-auth");

export const jwtTokenChecker = <Payload>(options: AuthOptions<Payload>) => {
  if (!isAuthOptions(options)) {
    throw new TypeError(
      `Expected IAuthOptions, received ${JSON.stringify(options)} instead`
    );
  }
  return (handler: PromiseHandler) => async (
    event: APIGatewayEvent,
    context: Context
  ) => {
    if ((event as any).auth !== undefined) {
      logger("event.auth already populated, has to be empty");
      throw createHttpError(400, "The events auth property has to be empty", {
        type: "EventAuthNotEmpty",
      });
    }

    const token =
      getTokenFromSource(event, options) ??
      getTokenFromAuthHeader(event, options);

    if (token === undefined) {
      return await handler(event, context);
    }

    logger("Verifying authorization token");
    try {
      jwt.verify(token, options.secretOrPublicKey, {
        algorithms: [options.algorithm],
      });
      logger("Token verified");
    } catch (err) {
      logger("Token could not be verified");

      if (err instanceof TokenExpiredError) {
        logger(`Token expired at ${new Date(err.expiredAt).toUTCString()}`);
        throw createHttpError(
          401,
          `Token expired at ${new Date(err.expiredAt).toUTCString()}`,
          {
            expiredAt: err.expiredAt,
            type: "TokenExpiredError",
          }
        );
      }

      if (err instanceof NotBeforeError) {
        logger(`Token not valid before ${err.date}`);
        throw createHttpError(401, `Token not valid before ${err.date}`, {
          date: err.date,
          type: "NotBeforeError",
        });
      }

      throw createHttpError(401, "Invalid token", {
        type: "InvalidToken",
      });
    }

    const payload = jwt.decode(token);
    if (options.isPayload !== undefined) {
      logger("Verifying token payload");
      if (!options.isPayload(payload)) {
        logger(`Token payload malformed, was ${JSON.stringify(payload)}`);
        throw createHttpError(
          400,
          `Token payload malformed, was ${JSON.stringify(payload)}`,
          {
            payload,
            type: "TokenPayloadMalformedError",
          }
        );
      }
      logger("Token payload valid");
    }

    const auth = {
      payload: jwt.decode(token),
      token,
    };
    return await handler({ ...event, auth }, context);
  };
};

export { EncryptionAlgorithms, AuthOptions, isAuthOptions };
export {
  AuthorizedEvent,
  isAuthorizedEvent,
} from "./interfaces/AuthorizedEvent";
