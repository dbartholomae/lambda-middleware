/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isString(str: any): str is string {
  return typeof str === "string";
}
