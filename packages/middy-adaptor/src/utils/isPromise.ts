export function isPromise(promise: any): promise is Promise<any> {
  return (
    promise &&
    typeof promise.then === 'function' &&
    typeof promise.catch === 'function'
  )
}
