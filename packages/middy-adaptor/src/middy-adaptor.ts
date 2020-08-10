import debugFactory, { IDebugger } from "debug";
import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import {
  Instance,
  MiddlewareObject,
  PromisifiedMiddlewareObject,
} from "./interfaces/MiddyTypes";
import { promisifyMiddyMiddleware } from "./utils/promisifyMiddyMiddleware";

const logger: IDebugger = debugFactory("@lambda-middleware/middy-adaptor");

export const middyAdaptor = <Event>(
  middyMiddleware: MiddlewareObject<unknown, unknown>
) => (handler: PromiseHandler<Event, unknown>) => async (
  event: Event,
  context: Context
) => {
  let callbackCalled = false;
  let callbackError: unknown = undefined;
  let callbackResponse: unknown = undefined;

  const callback = (error: unknown, result: unknown) => {
    logger("instance callback function called");
    callbackCalled = true;
    callbackError = error;
    callbackResponse = result;
  };

  const instance: Instance = {
    context: { ...context },
    event: { ...event },
    response: null,
    error: null,
    callback,
  };

  const promisifiedMiddyMiddleware: PromisifiedMiddlewareObject = {};

  for (const key in middyMiddleware) {
    promisifiedMiddyMiddleware[key] = promisifyMiddyMiddleware(
      middyMiddleware[key]
    );
  }

  logger("Checking for before middleware");
  if (promisifiedMiddyMiddleware.before !== undefined) {
    logger("Calling before middleware");
    await promisifiedMiddyMiddleware.before(instance);
    logger("before middleware called");
    if (callbackCalled) {
      logger("callback called in before middleware");
      if (callbackError) {
        throw callbackError;
      }
      return callbackResponse;
    }
  }
  try {
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
  if (callbackCalled) {
    logger("callback called in after or onError middleware");
    if (callbackError) {
      throw callbackError;
    }
    return callbackResponse;
  }
  logger("returning response");
  return instance.response;
};
