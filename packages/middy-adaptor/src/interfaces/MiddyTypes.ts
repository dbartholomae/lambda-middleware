import { Callback, Context } from "aws-lambda";

export interface MiddlewareObject<
  Event,
  Response,
  ContextLike extends Context = Context
> {
  before?: MiddlewareFunction<Event, Response, ContextLike>;
  after?: MiddlewareFunction<Event, Response, ContextLike>;
  onError?: MiddlewareFunction<Event, Response, ContextLike>;
}

export type MiddlewareFunction<
  Event,
  Response,
  ContextLike extends Context = Context
> = (
  instance: Instance<Event, Response, ContextLike>,
  next: NextFunction
) => void | Promise<any>;

export type NextFunction = (error?: any) => void;

export interface Instance<
  Event = any,
  Response = any,
  ContextLike extends Context = Context
> {
  event: Event;
  context: ContextLike;
  response: Response;
  error: Error | null;
  callback: Callback<Response>;
}

export type PromisifiedMiddlewareFunction<T, R, C extends Context> = (
  instance: Instance<T, R, C>
) => Promise<any>;

export type PromisifiedMiddlewareObject<T, R, C extends Context> = {
  before?: PromisifiedMiddlewareFunction<T, R, C>;
  after?: PromisifiedMiddlewareFunction<T, R, C>;
  onError?: PromisifiedMiddlewareFunction<T, R, C>;
};
