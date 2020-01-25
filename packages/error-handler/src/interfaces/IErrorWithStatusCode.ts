export interface IErrorWithStatusCode {
  statusCode: number
}

export function isErrorWithStatusCode (
  error: any
): error is IErrorWithStatusCode {
  return typeof error.statusCode === 'number'
}
