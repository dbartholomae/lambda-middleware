import { TypeGuard } from "./TypeGuard";

export function optional<Type>(
  typeGuard: TypeGuard<Type>
): TypeGuard<Type | undefined> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (obj: any): obj is Type | undefined =>
    obj === undefined || typeGuard(obj);
}
