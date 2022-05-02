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

  private removeAdditionalProperties(body: T): T {
    while (Object.keys(body).length && !this.validate(body)) {
      body = this.removeAdditionalProperty(body);
    }

    return body;
  }

  private removeAdditionalProperty(body: T): T {
    const additionalPropertyError = this.findAdditionalPropertyError();

    if (!additionalPropertyError) {
      return body;
    }

    delete body[this.keyOfAdditionalProperty(additionalPropertyError)];

    return body;
  }

  private findAdditionalPropertyError(): ErrorObject | undefined {
    return this.validate.errors?.find(
      (error) =>
        error.keyword === AdditionalPropertiesErrorHandler.ERROR_KEYWORD
    );
  }

  private keyOfAdditionalProperty(error: ErrorObject): keyof T {
    return error.params[AdditionalPropertiesErrorHandler.ERROR_PARAM_KEY];
  }
}
