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
  logger(`Checking input ${event.body}`);
  try {
    let ajv = new Ajv({ allErrors: true });
  
    if (options.ajv.options) {
      ajv = new Ajv(options.ajv.options);
    }
  
    const validate = ajv.compile(options.ajv.schema);
    const body: T = JSON.parse(event.body || "{}");
    const errorHandlers = [new AdditionalPropertiesErrorHandler({ validate })];
  
    errorHandlers.forEach((errorHandler) => errorHandler.handleError(body));
  
    if (validate(body)) {
      logger("Input is valid");
      return handler({ ...event, body }, context);
    }
  
    const error: {
      statusCode: number;
      message: string;
    } = {
      statusCode: 400,
      message: validate.errors!.map((error) => error.message).join("\n")
    };
  
    logger(`Input is invalid. Error: ${error}`);
    return Promise.reject(error);
  } catch (error) {
    (error as { statusCode?: number }).statusCode = 400;
    logger(`Input is invalid. Error: ${error}`);
    return Promise.reject(error)
  }
};
