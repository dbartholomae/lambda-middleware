import { MiddlewareObject, PromisifiedMiddlewareObject } from "..";
import { promisifyMiddyMiddlewareFunction } from "./promisifyMiddyMiddlewareFunction";

export function promisifyMiddyMiddleware(
  middyMiddleware: MiddlewareObject<unknown, unknown>
): PromisifiedMiddlewareObject {
  const promisifiedMiddyMiddleware: PromisifiedMiddlewareObject = {};

  for (const key in middyMiddleware) {
    promisifiedMiddyMiddleware[key] = promisifyMiddyMiddlewareFunction(
      middyMiddleware[key]
    );
  }
  return promisifiedMiddyMiddleware;
}
