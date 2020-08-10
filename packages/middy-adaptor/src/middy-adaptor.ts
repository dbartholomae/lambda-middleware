import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import { Instance, MiddlewareObject } from "./interfaces/MiddyTypes";
import { logger } from "./logger";
import { CallbackListener } from "./CallbackListener/CallbackListener";
import { MiddyMiddleware } from "./MiddyMiddleware/MiddyMiddleware";

export const middyAdaptor = <Event, Response>(
  middyMiddlewareObject: MiddlewareObject<unknown, unknown>
) => (handler: PromiseHandler<Event, Response>) => async (
  event: Event,
  context: Context
): Promise<Response> => {
  const callbackListener = new CallbackListener();
  const instance: Instance = {
    context: { ...context },
    event: { ...event },
    response: null,
    error: null,
    callback: callbackListener.callback,
  };

  const middyMiddleware = new MiddyMiddleware(middyMiddlewareObject);

  try {
    await middyMiddleware.before(instance);

    if (callbackListener.callbackCalled) {
      return callbackListener.handleCallback();
    }

    logger("Calling handler");
    instance.response = await handler(instance.event, context);
    logger("handler ran successfully");

    await middyMiddleware.after(instance);
  } catch (error) {
    logger("error in handler or before or after middleware");
    instance.error = error;
    const newError = await middyMiddleware.onError(instance, error);
    if (newError) {
      throw newError;
    }
  }
  if (callbackListener.callbackCalled) {
    return callbackListener.handleCallback();
  }
  logger("returning response");
  return instance.response;
};
