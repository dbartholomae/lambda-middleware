// based on https://github.com/ramda/ramda/blob/v0.26.1/source/omit.js
// and https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/ramda/index.d.ts#L1260
export function omit<T, K extends string> (
  names: readonly K[],
  obj: T
): Omit<T, K> {
  const result: any = {}
  const index: any = {}
  let idx = 0
  const len = names.length

  while (idx < len) {
    index[names[idx]] = 1
    idx += 1
  }

  for (const prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop]
    }
  }
  return result
}
