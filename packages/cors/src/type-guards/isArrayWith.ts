import { TypeGuard } from "./TypeGuard";

export function isArrayWith<Element>(
  typeGuard: TypeGuard<Element>
): TypeGuard<Element[]> {
  return (arr): arr is Element[] => Array.isArray(arr) && arr.every(typeGuard);
}
