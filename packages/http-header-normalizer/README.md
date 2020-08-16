# @lambda-middleware/http-header-normalizer

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fhttp-header-normalizer.svg)](https://npmjs.org/package/@lambda-middleware/http-header-normalizer)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fhttp-header-normalizer.svg)](https://npmjs.org/package/@lambda-middleware/http-header-normalizer)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

Middleware for AWS lambdas that normalizes headers to lower-case and referer to referrer and vice-versa.
If you are used to [the corresponding middy middleware](https://www.npmjs.com/package/@middy/http-header-normalizer), please note that this middleware acts differently as it does not hold an exception list and converts everything to lower-case.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { httpHeaderNormalizer } from "@lambda-middleware/http-header-normalizer";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld({
  headers,
}: APIGatewayProxyEvent): APIGatewayProxyResult {
  return {
    body: JSON.stringify({
      msg: headers["custom-header"],
    }),
    statusCode: 200,
  };
}

// Wrap the handler with the middleware
export const handler = httpHeaderNormalizer()(helloWorld);
```
