import { MiddlewareObject, PromisifiedMiddlewareObject } from "../index";
import { promisifyMiddyMiddlewareFunction } from "./promisifyMiddyMiddlewareFunction";
import { Context } from "aws-lambda";

export function promisifyMiddyMiddleware<T, R, C extends Context>(
  middyMiddleware: MiddlewareObject<T, R, C>
): PromisifiedMiddlewareObject<T, R, C> {
  return (Object.keys(middyMiddleware) as Array<
    keyof typeof middyMiddleware
  >).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: promisifyMiddyMiddlewareFunction(middyMiddleware[key]!),
    }),
    {}
  );
}
