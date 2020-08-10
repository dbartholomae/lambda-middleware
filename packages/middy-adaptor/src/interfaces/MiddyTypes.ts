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

type PromisifiedMiddlewareFunction = (instance: Instance) => Promise<any>;

export type PromisifiedMiddlewareObject = {
  before?: PromisifiedMiddlewareFunction;
  after?: PromisifiedMiddlewareFunction;
  onError?: PromisifiedMiddlewareFunction;
};
