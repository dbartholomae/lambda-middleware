/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isBoolean(bool: any): bool is boolean {
  return bool === true || bool === false;
}
