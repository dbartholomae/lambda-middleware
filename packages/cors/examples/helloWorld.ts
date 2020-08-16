import { cors } from "../";
import { APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: "",
  };
}

/**
 * Wrap the handler with the middleware. It can be used just with
 * default options or configured in detail.
 * If you are using an API Gateway or Serverless to deploy, please note
 * that they will overwrite some of these settings and need to be configured
 * separately.
 */
export const handler = cors({
  /**
   * Configures the Access-Control-Allow-Headers CORS header.
   * If not set will mirror Access-Control-Request-Headers from the request.
   */
  allowedHeaders: [],

  /** Configures the Cache-Control header for the preflight response. */
  cacheControl: "max-age: 300",

  /** Configures the Access-Control-Allow-Credentials CORS header. */
  allowCredentials: true,

  /** Configures the Access-Control-Expose-Headers CORS header. */
  exposedHeaders: ["X-Custom-Header"],

  /** Configures the Access-Control-Max-Age CORS header. */
  maxAge: 300,

  /** Configures the Access-Control-Allow-Methods CORS header. */
  allowedMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],

  /** Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204. */
  optionsSuccessStatus: 204,

  /** Configures the Access-Control-Allow-Origin CORS header. An empty array will set the header to '*'. */
  allowedOrigins: ["https://example.com"],

  /** Whether to call the next middleware or handler in case of a OPTIONS request. */
  preflightContinue: false,
})(helloWorld);
