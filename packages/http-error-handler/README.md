# @lambda-middleware/http-error-handler

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fhttp-error-handler.svg)](https://npmjs.org/package/@lambda-middleware/http-error-handler)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fhttp-error-handler.svg)](https://npmjs.org/package/@lambda-middleware/http-error-handler)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

An error handler middleware for AWS http lambda functions, compatible with [http-errors](https://www.npmjs.com/package/http-errors).

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as createHttpError from "http-errors";

// This is your AWS handler
async function helloWorld(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.search == null) {
    // If you throw an error with status code, the error will be returned as stringified JSON
    // Only the stack will be omitted.
    throw createHttpError(400, "Query has to include a search");
  }

  // If you throw an error with no status code, only a generic message will be shown to the user
  // instead of the full error
  throw new Error("Search is not implemented yet");
}

// Wrap the handler with the middleware
export const handler = errorHandler()(helloWorld);
```
