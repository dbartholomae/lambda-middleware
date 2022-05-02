import { JSONSchemaType, Options } from "ajv";

export interface AJVValidatorMiddlewareOptions<T> {
  ajv: {
    schema: JSONSchemaType<T>;
    options?: Options;
  }
}