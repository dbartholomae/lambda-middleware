/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isInt(int: any): int is number {
  return Number.isInteger(int);
}
