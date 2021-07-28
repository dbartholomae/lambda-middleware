export class RequestBodyNotJsonError extends Error {
  body: string;
  innerError: Error;

  // Ignoring the following constructor block due to how coverage is applied on certain transpiled ES5 code
  // see here for more details about this issue: https://github.com/microsoft/TypeScript/issues/13029
  /* istanbul ignore next */
  constructor(message: string, body: string, innerError: Error) {
    super(message);

    this.name = "RequestBodyNotJsonError";
    this.body = body;
    this.innerError = innerError;
  }
}
