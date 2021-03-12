import type { Context, Handler } from "aws-lambda";
import type { PromiseHandler } from ".";
import { isPromise } from "./isPromise";

export function promisifyHandler<Event, Response>(
  handler: Handler<Event, Response>
): PromiseHandler<Event, Response> {
  return function (event: Event, context: Context): Promise<Response> {
    return new Promise((resolve, reject) => {
      function callback(err: any, response: Response | undefined): void {
        if (err) {
          return reject(err);
        }
        return resolve(response);
      }

      const result = handler(event, context, callback);
      if (isPromise(result)) {
        result.then(resolve, reject);
      }
    });
  };
}
