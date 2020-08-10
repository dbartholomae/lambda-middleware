# @lambda-middleware/middy-adaptor

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fmiddy-adaptor.svg)](https://npmjs.org/package/@lambda-middleware/middy-adaptor)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fmiddy-adaptor.svg)](https://npmjs.org/package/@lambda-middleware/middy-adaptor)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

An adaptor to use [middy middleware](https://github.com/middyjs/middy) as functional middleware.
Please note that this will limit type safety.
If you the middleware returns a Promise, calls the `next` function and calls `instance.callback` (or any two of these), no specific behavior of this adaptor is guaranteed.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import {
  middyAdaptor,
  MiddlewareObject,
} from "@lambda-middleware/middy-adaptor";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (event.headers["before-middleware-ran"] === undefined) {
    throw new Error("Before middleware never ran");
  }
  if (event.headers["throw-error"] !== undefined) {
    throw new Error("Throw-error header is set");
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: "Hello World" }),
  };
}

// Import an existing middy middleware or write your own
function customMiddyMiddleware(): MiddlewareObject<any, any> {
  function createCustomHeaderAdder(headerName: string, headerValue: string) {
    return (
      instance: { response: any; error: Error | null },
      next: (error?: any) => void
    ): void => {
      instance.response = instance.response ?? { statusCode: 200 };
      instance.response.headers = instance.response.headers ?? {};
      instance.response.headers[headerName] = headerValue;
      next();
    };
  }

  return {
    before: async (instance: { event: any }): Promise<void> => {
      instance.event.headers = {
        ...instance.event.headers,
        "before-middleware-ran": "true",
      };
    },
    after: createCustomHeaderAdder("Custom-Test-After-Header", "set"),
    onError: createCustomHeaderAdder("Custom-Test-On-Error-Header", "set"),
  };
}

// Wrap the handler with the middleware
export const handler = middyAdaptor(customMiddyMiddleware())(helloWorld);
```
