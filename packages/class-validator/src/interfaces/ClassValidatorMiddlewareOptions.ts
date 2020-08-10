import { ClassType } from "class-transformer-validator";

export interface ClassValidatorMiddlewareOptions<T extends object> {
  bodyType: ClassType<T>;
}

export function isMiddlewareOptions(
  options: any
): options is ClassValidatorMiddlewareOptions<any> {
  return !!(options && options.bodyType);
}
