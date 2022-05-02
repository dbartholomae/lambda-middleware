import { PromiseHandler } from "@lambda-middleware/utils";
import Ajv from "ajv";
import { APIGatewayEvent, Context } from "aws-lambda";
import { AdditionalPropertiesErrorHandler } from "./handler/error/AdditionalPropertiesErrorHandler";
import { AJVValidatorMiddlewareOptions } from "./interfaces/AJVValidatorMiddlewareOptions";
import { logger } from "./logger";

export type WithBody<Event, Body> = Omit<Event, "body"> & { body: Body };

export const ajvValidator = <T extends object>(
  options: AJVValidatorMiddlewareOptions<T>
) => <R>(handler: PromiseHandler<WithBody<APIGatewayEvent, T>, R>) => async (
  event: APIGatewayEvent,
  context: Context
): Promise<R> => {
  logger(`Checking input ${JSON.stringify(event.body)}`);
  let ajv = new Ajv({ allErrors: true });

  if (options.ajv.options) {
    ajv = new Ajv(options.ajv.options);
  }

  const validate = ajv.compile(options.ajv.schema);
  const body: T = JSON.parse(event.body ?? "{}");
  const errorHandlers = [new AdditionalPropertiesErrorHandler({ validate })];

  errorHandlers.forEach((errorHandler) => errorHandler.handleError(body));

  if (validate(body)) {
    return handler({ ...event, body }, context);
  }

  return Promise.reject();
};
