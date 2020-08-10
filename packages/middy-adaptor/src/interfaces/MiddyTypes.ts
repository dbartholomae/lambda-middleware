import { Callback, Context } from "aws-lambda";

export interface MiddlewareObject<T, R, C extends Context = Context> {
  before?: MiddlewareFunction<T, R, C>;
  after?: MiddlewareFunction<T, R, C>;
  onError?: MiddlewareFunction<T, R, C>;
}

export type MiddlewareFunction<T, R, C extends Context = Context> = (
  instance: Instance<T, R, C>,
  next: NextFunction
) => void | Promise<any>;

export type NextFunction = (error?: any) => void;

export interface Instance<T = any, V = any, C extends Context = Context> {
  event: T;
  context: C;
  response: V;
  error: Error | null;
  callback: Callback<V>;
}

type PromisifiedMiddlewareFunction = (instance: Instance) => Promise<any>;

export type PromisifiedMiddlewareObject = {
  before?: PromisifiedMiddlewareFunction;
  after?: PromisifiedMiddlewareFunction;
  onError?: PromisifiedMiddlewareFunction;
};
