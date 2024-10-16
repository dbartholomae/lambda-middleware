import { PromiseHandler } from "@lambda-middleware/utils";
import debugFactory, { IDebugger } from "debug";
import { APIGatewayEvent, Context } from "aws-lambda";
import { Type, TypeCompiler } from "@sinclair/typebox";

const logger: IDebugger = debugFactory("@lambda-middleware/typebox-validator");

export type WithBody<Event, Body> = Omit<Event, "body"> & { body: Body };

export const typeboxValidator = <T extends object>(schema: Type<T>) => <R>(
  handler: PromiseHandler<WithBody<APIGatewayEvent, T>, R>
) => async (event: APIGatewayEvent, context: Context): Promise<R> => {
  logger(`Checking input ${JSON.stringify(event.body)}`);
  try {
    const body = event.body ?? "{}";
    const compiledSchema = TypeCompiler.Compile(schema);
    const validationResult = compiledSchema.Check(JSON.parse(body));
    if (!validationResult) {
      throw new Error("Validation failed");
    }
    logger("Input is valid");
    return handler({ ...event, body: JSON.parse(body) }, context);
  } catch (error) {
    logger("Input is invalid");
    (error as { statusCode?: number }).statusCode = 400;
    throw error;
  }
};
