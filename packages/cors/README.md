# @lambda-middleware/cors

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fcors.svg)](https://npmjs.org/package/@lambda-middleware/cors)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fcors.svg)](https://npmjs.org/package/@lambda-middleware/cors)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

AWS lambda middleware for automatically adding CORS headers.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { cors } from "@lambda-middleware/cors";
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
```
