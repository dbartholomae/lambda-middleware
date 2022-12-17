import { compose } from "./compose";

export function composeHandler<V, T1>(fn0: (x: V) => T1, handler: V): T1 & { handler: V };;
export function composeHandler<V, T1, T2>(
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T2 & { handler: V };
export function composeHandler<V, T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T3 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T4 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T5 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T6 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5, T6, T7>(
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T7 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5, T6, T7, T8>(
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T8 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn8: (x: T8) => T9,
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T9 & { handler: V };
export function composeHandler<V, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  fn9: (x: T9) => T10,
  fn8: (x: T8) => T9,
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (x: V) => T1,
  handler: V
): T10 & { handler: V };
export function composeHandler(...fns: Function[]): any {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  const composed = compose(...fns.slice(0, fns.length - 1))(fns[fns.length - 1]);
  composed.handler = fns[fns.length - 1];
  return composed;
}
