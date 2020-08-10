import { Context } from "aws-lambda";

import { Instance, MiddlewareObject, PromisifiedMiddlewareObject } from "..";
import { promisifyMiddyMiddleware } from "./promisifyMiddyMiddleware";
import { logger } from "../logger";

export class MiddyMiddleware<T, R, C extends Context = Context> {
  private middlewareObject: PromisifiedMiddlewareObject;
  constructor(middlewareObject: MiddlewareObject<T, R, C>) {
    this.middlewareObject = promisifyMiddyMiddleware(middlewareObject);
  }

  public async onError(
    instance: Instance,
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

  public async before(instance: Instance): Promise<void> {
    return this.run("before", instance);
  }

  public async after(instance: Instance): Promise<void> {
    return this.run("after", instance);
  }

  private async run(
    middlewareType: keyof PromisifiedMiddlewareObject,
    instance: Instance
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
