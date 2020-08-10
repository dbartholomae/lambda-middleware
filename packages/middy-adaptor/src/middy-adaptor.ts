import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import { Instance, MiddlewareObject } from "./interfaces/MiddyTypes";
import { logger } from "./logger";
import { CallbackListener } from "./CallbackListener/CallbackListener";
import { promisifyMiddyMiddleware } from "./utils/promisifyMiddyMiddleware";

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
    logger("Checking for before middleware");
    if (promisifiedMiddyMiddleware.before !== undefined) {
      logger("Calling before middleware");
      await promisifiedMiddyMiddleware.before(instance);
      logger("before middleware called");
      if (callbackListener.callbackCalled) {
        return callbackListener.handleCallback();
      }
    }

    logger("Calling handler");
    instance.response = await handler(instance.event, context);
    logger("handler ran successfully");
    logger("Checking for after middleware");
    if (promisifiedMiddyMiddleware.after !== undefined) {
      logger("Calling after middleware");
      await promisifiedMiddyMiddleware.after(instance);
      logger("after middleware called");
    }
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
