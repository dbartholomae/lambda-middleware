type JSONPrimitive = string | number | boolean | JSONObject | null | undefined;

export type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];
