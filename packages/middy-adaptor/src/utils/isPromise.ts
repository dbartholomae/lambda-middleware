export function isPromise(promise: any): promise is Promise<unknown> {
  return (
    promise &&
    typeof promise.then === "function" &&
    typeof promise.catch === "function"
  );
}
