# @lambda-middleware/compose

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fcompose.svg)](https://npmjs.org/package/@lambda-middleware/compose)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fcompose.svg)](https://npmjs.org/package/@lambda-middleware/compose)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A compose function for lambda middleware. This is a pure convenience copy of [ramda's compose](https://ramdajs.com/docs/#compose), using it directly or using other compose functions works as well.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { compose } from "@lambda-middleware/compose";
import { PromiseHandler } from "@lambda-middleware/utils";
import { Context, ProxyHandler, APIGatewayEvent } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<object> {
  return {
    message: "Hello world!",
  };
}

// Write your own middleware
const stringifyToBody = () => (
  handle: PromiseHandler<APIGatewayEvent, object>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handle(event, context);
  return {
    body: JSON.stringify(response),
  };
};

const addStatusCode = (statusCode: number) => (
  handle: PromiseHandler<APIGatewayEvent, { body: string }>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handle(event, context);
  return {
    ...response,
    statusCode,
  };
};

// Wrap the handler with the middleware.
// With compose you can wrap multiple middlewares around one handler.
export const handler: ProxyHandler = compose(
  addStatusCode(200),
  stringifyToBody()
)(helloWorld);
```
