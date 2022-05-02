import { ValidateFunction } from "ajv";
import { AJVErrorHandlerOptions } from "../../interfaces/AJVErrorHandlerOptions";

export abstract class AJVErrorHandler<T> {
  protected readonly validate: ValidateFunction<T>;

  constructor({ validate }: AJVErrorHandlerOptions<T>) {
    this.validate = validate;
  }

  abstract handleError(body: T): T;
}
