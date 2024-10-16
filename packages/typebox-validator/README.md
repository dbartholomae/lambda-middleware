# @lambda-middleware/typebox-validator

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Ftypebox-validator.svg)](https://npmjs.org/package/@lambda-middleware/typebox-validator)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Ftypebox-validator.svg)](https://npmjs.org/package/@lambda-middleware/typebox-validator)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A validation middleware for AWS http lambda functions based on [typebox](https://github.com/sinclairzx81/typebox).

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { Type } from "@sinclair/typebox";
import { typeboxValidator } from "@lambda-middleware/typebox-validator";
import { APIGatewayProxyResult } from "aws-lambda";

const NameBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
});

type NameBody = {
  firstName: string;
  lastName: string;
};

async function helloWorld(event: { body: NameBody }): Promise<APIGatewayProxyResult> {
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      "content-type": "text",
    },
    statusCode: 200,
  };
}

export const handler = composeHandler(
  errorHandler(),
  typeboxValidator(NameBodySchema),
  helloWorld
);
```
