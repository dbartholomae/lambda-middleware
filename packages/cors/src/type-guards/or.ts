import { TypeGuard } from "./TypeGuard";

export function or<FirstType, SecondType>(
  firstTypeGuard: TypeGuard<FirstType>,
  secondTypeGuard: TypeGuard<SecondType>
): TypeGuard<FirstType | SecondType> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (obj: any): obj is FirstType | SecondType =>
    firstTypeGuard(obj) || secondTypeGuard(obj);
}
