import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import { logger } from "./logger";

export const doNotWait = <Event, Response>() => (
  handler: PromiseHandler<Event, Response>
) => async (event: Event, context: Context): Promise<Response> => {
  logger("Running handler");
  context.callbackWaitsForEmptyEventLoop = false;
  return handler(event, context);
};
