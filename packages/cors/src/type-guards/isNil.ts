/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isNil(obj: any): obj is null | undefined {
  return obj == null;
}
