type JSONPrimitive = string | number | boolean | JSONObject;

export type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];
