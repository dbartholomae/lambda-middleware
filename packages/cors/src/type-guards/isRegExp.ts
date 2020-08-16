/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isRegExp(regex: any): regex is RegExp {
  return regex instanceof RegExp;
}
