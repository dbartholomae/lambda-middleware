import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import { Context } from "aws-lambda";
import { ClassValidatorMiddlewareOptions } from "./interfaces/ClassValidatorMiddlewareOptions";
import { transformAndValidate } from "class-transformer-validator";

const logger: IDebugger = debugFactory("@lambda-middleware/class-transformer");

export type WithBody<Event, Body> = Omit<Event, "body"> & { body: Body };

export const classValidator = <
  E extends { body: string | null },
  R,
  T extends object
>(
  options: ClassValidatorMiddlewareOptions<T>
) => (handler: PromiseHandler<WithBody<E, T>, R>) => async (
  event: E,
  context: Context
): Promise<R> => {
  logger(`Checking input ${JSON.stringify(event.body)}`);
  try {
    const body = event.body ?? "{}";
    const transformedBody = (await transformAndValidate(
      options.classType,
      body === "" ? "{}" : body,
      { validator: { whitelist: true } }
    )) as T;
    logger("Input is valid");
    return handler({ ...event, body: transformedBody }, context);
  } catch (error) {
    logger("Input is invalid");
    error.statusCode = 400;
    throw error;
  }
};
