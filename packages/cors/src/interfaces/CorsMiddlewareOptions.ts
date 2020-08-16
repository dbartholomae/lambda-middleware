import {
  isString,
  isArrayWith,
  isNil,
  isNull,
  isBoolean,
  isInt,
  isRegExp,
  optional,
  or,
} from "../type-guards";

type HttpMethod =
  | "GET"
  | "POST"
  | "HEAD"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export interface CorsMiddlewareOptions {
  /**
   * Configures the Access-Control-Allow-Headers CORS header.
   * If not set will mirror Access-Control-Request-Headers from the request.
   */
  allowedHeaders?: string[] | null;

  /** Configures the Cache-Control header for the preflight response. */
  cacheControl?: string | null;

  /** Configures the Access-Control-Allow-Credentials CORS header. */
  allowCredentials?: boolean;

  /** Configures the Access-Control-Expose-Headers CORS header. */
  exposedHeaders?: string[];

  /** Configures the Access-Control-Max-Age CORS header. */
  maxAge?: number | null;

  /** Configures the Access-Control-Allow-Methods CORS header. */
  allowedMethods?: HttpMethod[];

  /** Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204. */
  optionsSuccessStatus?: number;

  /** Configures the Access-Control-Allow-Origin CORS header. An empty array will set the header to '*'. */
  allowedOrigins?: (string | RegExp)[];

  /** Whether to call the next middleware or handler in case of a OPTIONS request. */
  preflightContinue?: boolean;
}

export function isCorsMiddlewareOptions(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  options: any
): options is CorsMiddlewareOptions {
  return (
    !isNil(options) &&
    optional(or(isNull, isArrayWith(isString)))(options.allowedHeaders) &&
    optional(isArrayWith(isString))(options.exposedHeaders) &&
    optional(isArrayWith(isString))(options.allowedMethods) &&
    optional(isArrayWith(or(isString, isRegExp)))(options.allowedOrigins) &&
    optional(isBoolean)(options.allowCredentials) &&
    optional(isBoolean)(options.preflightContinue) &&
    optional(or(isNull, isInt))(options.maxAge) &&
    optional(or(isNull, isString))(options.cacheControl) &&
    optional(isInt)(options.optionsSuccessStatus)
  );
}
