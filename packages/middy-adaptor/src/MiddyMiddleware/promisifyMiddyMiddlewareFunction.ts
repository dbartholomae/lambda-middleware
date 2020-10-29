import {
  Instance,
  MiddlewareFunction,
  PromisifiedMiddlewareFunction,
} from "../interfaces/MiddyTypes";
import { isPromise } from "../utils/isPromise";
import { Context } from "aws-lambda";

export function promisifyMiddyMiddlewareFunction<T, R, C extends Context>(
  fn: MiddlewareFunction<T, R, C> | undefined
): PromisifiedMiddlewareFunction<T, R, C> | undefined {
  if (fn === undefined) {
    return undefined;
  }

  return (instance: Instance<T, R, C>) => {
    return new Promise((resolve, reject) => {
      function next(err: unknown): void {
        if (err) {
          return reject(err);
        }
        return resolve();
      }

      const result = fn(instance, next);
      if (isPromise(result)) {
        result.then(resolve, reject);
      }
    });
  };
}
