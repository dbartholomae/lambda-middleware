import { ClassType } from "class-transformer-validator";

export interface ClassValidatorMiddlewareOptions<T extends object> {
  classType: ClassType<T>;
}

export function isMiddlewareOptions(
  options: any
): options is ClassValidatorMiddlewareOptions<any> {
  return !!(options && options.classType);
}
