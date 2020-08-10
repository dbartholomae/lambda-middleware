import { Instance, PromisifiedMiddlewareObject } from "..";
import { logger } from "../logger";

export async function runMiddleware(
  middlewareObject: PromisifiedMiddlewareObject,
  middlewareType: keyof PromisifiedMiddlewareObject,
  instance: Instance
) {
  logger(`Checking for ${middlewareType} middleware`);

  const middleware = middlewareObject[middlewareType];
  if (middleware === undefined) {
    return;
  }

  logger(`Calling ${middlewareType} middleware`);
  await middleware(instance);
  logger(`${middlewareType} middleware called`);
}
