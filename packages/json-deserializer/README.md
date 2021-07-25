# @lambda-middleware/json-deserializer

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fjson-deserializer.svg)](https://npmjs.org/package/@lambda-middleware/json-deserializer)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fjson-deserializer.svg)](https://npmjs.org/package/@lambda-middleware/json-deserializer)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A middleware for AWS http lambda functions to deserialize incoming requests containing a json body.

Depending on the request payload and header the following can happen:

- **The event has a valid json content-type header** (eg. `application/json`), and:
  - **The body contains a valid JSON payload** - body is deserialized and the event object body property is replaced with an object of type Record<string, unknown>.
  - **The body has invalid JSON payload** - the middleware throws a `RequestBodyNotJsonError`.
- **The event has a non json content-type header** - the middleware will replace the body with `null`.
- **The event has no body set** - the middleware will replace the body with `null`.

Please note that this middleware just provides a basic object to the handler, without typing for the properties, you will need to handle validation of the request body object separately.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { jsonDeserializer } from "@lambda-middleware/json-deserializer";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "../lib/types/APIGatewayProxyObjectEvent";

// This is your AWS handler
async function helloWorld(
  request: APIGatewayProxyObjectEvent<APIGatewayProxyEvent>
): Promise<APIGatewayProxyResult> {

  // We can simply pick out the body object from the request and use it
  const { body: originalBody } = request ?? {};

  // Do something with the object and return it
  return {
    statusCode: 200,
    body: JSON.stringify({
      ...originalBody,
      additionalThing: "addedInHandler",
    }),
  };
}

// Wrap the handler with the middleware
export const handler = jsonDeserializer()(helloWorld);
```
