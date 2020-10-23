import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import { APIGatewayEvent, Context } from "aws-lambda";
import { ClassValidatorMiddlewareOptions } from "./interfaces/ClassValidatorMiddlewareOptions";
import { transformAndValidate } from "class-transformer-validator";

const logger: IDebugger = debugFactory("@lambda-middleware/class-transformer");

export type WithBody<Event, Body> = Omit<Event, "body"> & { body: Body };

export const classValidator = <T extends object>(
  options: ClassValidatorMiddlewareOptions<T>
) => <R>(handler: PromiseHandler<WithBody<APIGatewayEvent, T>, R>) => async (
  event: APIGatewayEvent,
  context: Context
): Promise<R> => {
  logger(`Checking input ${JSON.stringify(event.body)}`);
  try {
    const body = event.body ?? "{}";
    const transformer = options.transformer;
    const validator = options.validator ?? {
      whitelist: true,
    };
    const transformedBody = (await transformAndValidate(
      options.bodyType,
      body === "" ? "{}" : body,
      { transformer, validator }
    )) as T;
    logger("Input is valid");
    return handler({ ...event, body: transformedBody }, context);
  } catch (error) {
    logger("Input is invalid");
    error.statusCode = 400;
    throw error;
  }
};
