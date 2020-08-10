// tslint:disable-next-line:ban-types
function composeTwo(f: Function, g: Function) {
  return function (this: any) {
    // eslint-disable-next-line prefer-rest-params
    return f.call(this, g.apply(this, arguments));
  };
}

export function compose<V extends any[], T1>(
  fn0: (...args: V) => T1
): (...args: V) => T1;
export function compose<V extends any[], T1, T2>(
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T2;
export function compose<V extends any[], T1, T2, T3>(
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T3;
export function compose<V extends any[], T1, T2, T3, T4>(
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T4;
export function compose<V extends any[], T1, T2, T3, T4, T5>(
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T5;
export function compose<V extends any[], T1, T2, T3, T4, T5, T6>(
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T6;
export function compose<V extends any[], T1, T2, T3, T4, T5, T6, T7>(
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T7;
export function compose<V extends any[], T1, T2, T3, T4, T5, T6, T7, T8>(
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T8;
export function compose<V extends any[], T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn8: (x: T8) => T9,
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T9;
export function compose<
  V extends any[],
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10
>(
  fn9: (x: T9) => T10,
  fn8: (x: T8) => T9,
  fn7: (x: T7) => T8,
  fn6: (x: T6) => T7,
  fn5: (x: T5) => T6,
  fn4: (x: T4) => T5,
  fn3: (x: T3) => T4,
  fn2: (x: T2) => T3,
  fn1: (x: T1) => T2,
  fn0: (...args: V) => T1
): (...args: V) => T10;
// tslint:disable-next-line:ban-types
export function compose(...fns: Function[]): any {
  if (fns.length === 0) {
    throw new TypeError("compose requires at least one argument");
  }

  return fns.slice(1).reduce(composeTwo, fns[0]);
}
