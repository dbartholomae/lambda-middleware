function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<
  Target extends Record<string, any>,
  Source extends Record<string, any>
>(target?: Target, source?: Source): Target & Source {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: keyof Source) => {
      const sourceElement = source[key];
      if (isObject(sourceElement)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceElement });
        } else {
          output[key as any] = deepMerge(
            target[key as keyof Target],
            sourceElement
          );
        }
      } else {
        Object.assign(output, { [key]: sourceElement });
      }
    });
  }

  return output as Target & Source;
}
