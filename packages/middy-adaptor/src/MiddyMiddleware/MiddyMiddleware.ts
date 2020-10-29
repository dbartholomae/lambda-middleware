import { Context } from "aws-lambda";

import { Instance, MiddlewareObject, PromisifiedMiddlewareObject } from "..";
import { promisifyMiddyMiddleware } from "./promisifyMiddyMiddleware";
import { logger } from "../logger";

export class MiddyMiddleware<T, R, C extends Context = Context> {
  private readonly middlewareObject: PromisifiedMiddlewareObject<T, R, C>;
  constructor(middlewareObject: MiddlewareObject<T, R, C>) {
    this.middlewareObject = promisifyMiddyMiddleware(middlewareObject);
  }

  public async onError(
    instance: Instance<T, R, C>,
    defaultReturn: any
  ): Promise<any | undefined> {
    logger("Checking for onError middleware");
    if (this.middlewareObject.onError === undefined) {
      return defaultReturn;
    }

    logger("Calling onError middleware");
    return await this.middlewareObject.onError(instance);
    logger("onError middleware called");
  }

  public async before(instance: Instance<T, R, C>): Promise<void> {
    return this.run("before", instance);
  }

  public async after(instance: Instance<T, R, C>): Promise<void> {
    return this.run("after", instance);
  }

  private async run(
    middlewareType: keyof PromisifiedMiddlewareObject<T, R, C>,
    instance: Instance<T, R, C>
  ): Promise<void> {
    logger(`Checking for ${middlewareType} middleware`);

    const middleware = this.middlewareObject[middlewareType];
    if (middleware === undefined) {
      return;
    }

    logger(`Calling ${middlewareType} middleware`);
    await middleware(instance);
    logger(`${middlewareType} middleware called`);
  }
}
