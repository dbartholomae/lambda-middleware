import { ErrorObject } from "ajv";
import { AJVErrorHandlerOptions } from "../../interfaces/AJVErrorHandlerOptions";
import { AJVErrorHandler } from "./AJVErrorHandler";

export class AdditionalPropertiesErrorHandler<T> extends AJVErrorHandler<T> {
  public static readonly ERROR_KEYWORD = "additionalProperties";
  public static readonly ERROR_PARAM_KEY = "additionalProperty";

  constructor(options: AJVErrorHandlerOptions<T>) {
    super(options);
  }

  handleError(body: T): T {
    return this.removeAdditionalProperties(body);
  }

  private removeAdditionalProperties(body: Readonly<T>): T {
    while (Object.keys(body).length && !this.validate(body)) {
      const additionalProperty = this.findAdditionalProperty();

      if (!additionalProperty) {
        break;
      }

      delete body[additionalProperty];
    }

    return body;
  }

  private findAdditionalProperty(): string | undefined {
    let result: string | undefined = undefined;

    const error = this.findAdditionalPropertyError();

    if (error) {
      result = this.keyOfAdditionalProperty(error);
    }

    return result;
  }

  private findAdditionalPropertyError(): ErrorObject | undefined {
    return this.validate.errors?.find(
      (error) =>
        error.keyword === AdditionalPropertiesErrorHandler.ERROR_KEYWORD
    );
  }

  private keyOfAdditionalProperty(error: ErrorObject): string {
    return error.params[AdditionalPropertiesErrorHandler.ERROR_PARAM_KEY];
  }
}
