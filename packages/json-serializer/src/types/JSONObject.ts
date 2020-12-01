type JSONPrimitive = string | number | boolean | JSONObject | undefined;

export type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];
