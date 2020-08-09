export interface ErrorWithStatusCode {
  statusCode: number;
}

export function isErrorWithStatusCode(
  error: any
): error is ErrorWithStatusCode {
  return typeof error.statusCode === "number";
}
