import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import { Instance, MiddlewareObject } from "./interfaces/MiddyTypes";
import { logger } from "./logger";
import { CallbackListener } from "./CallbackListener/CallbackListener";
import { promisifyMiddyMiddleware } from "./utils/promisifyMiddyMiddleware";
import { runMiddleware } from "./utils/runMiddleware";

export const middyAdaptor = <Event>(
  middyMiddleware: MiddlewareObject<unknown, unknown>
) => (handler: PromiseHandler<Event, unknown>) => async (
  event: Event,
  context: Context
) => {
  const callbackListener = new CallbackListener();
  const instance: Instance = {
    context: { ...context },
    event: { ...event },
    response: null,
    error: null,
    callback: callbackListener.callback,
  };

  const promisifiedMiddyMiddleware = promisifyMiddyMiddleware(middyMiddleware);

  try {
    await runMiddleware(promisifiedMiddyMiddleware, "before", instance);
    if (callbackListener.callbackCalled) {
      return callbackListener.handleCallback();
    }

    logger("Calling handler");
    instance.response = await handler(instance.event, context);
    logger("handler ran successfully");

    await runMiddleware(promisifiedMiddyMiddleware, "after", instance);
  } catch (error) {
    logger("error in handler or before or after middleware");
    instance.error = error;
    let newError = error;
    logger("Checking for onError middleware");
    if (promisifiedMiddyMiddleware.onError !== undefined) {
      logger("Calling onError middleware");
      newError = await promisifiedMiddyMiddleware.onError(instance);
      logger("onError middleware called");
    }
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
