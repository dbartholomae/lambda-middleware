import { ValidateFunction } from "ajv";

export interface AJVErrorHandlerOptions<T> {
  validate: ValidateFunction<T>;
}
