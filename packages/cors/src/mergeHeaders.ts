import { HashMap } from "./interfaces/HashMap";

function splitHeaderValues(value: string | boolean | number = ""): string[] {
  return value.toString().split(",");
}

type PrimitiveHashMap = HashMap<string | number | boolean>;

export function mergeHeaders(...headers: PrimitiveHashMap[]): PrimitiveHashMap {
  return headers.reduce((totalHeaders, addedHeaders) => {
    const newHeaders = { ...totalHeaders, ...addedHeaders };
    if (Object.keys(addedHeaders).includes("Vary")) {
      newHeaders["Vary"] = splitHeaderValues(addedHeaders["Vary"])
        .concat(splitHeaderValues(totalHeaders["Vary"]))
        .join(",");
    }
    return newHeaders;
  }, {});
}
