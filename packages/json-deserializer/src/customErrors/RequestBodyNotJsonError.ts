export class RequestBodyNotJsonError extends Error {
  body: string;
  innerError: Error;

  constructor(message: string, body: string, innerError: Error) {
    super(message);
    this.name = "RequestBodyNotJsonError";
    this.body = body;
    this.innerError = innerError;
  }
}
