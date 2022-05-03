# @lambda-middleware/ajv-validator

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fajv-validator.svg)](https://npmjs.org/package/@lambda-middleware/ajv-validator)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fajv-validator.svg)](https://npmjs.org/package/@lambda-middleware/ajv-validator)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A validation middleware for AWS http lambda functions based on AJV.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { JSONSchemaType } from "ajv";
import { APIGatewayProxyResult } from "aws-lambda";
import { ajvValidator } from "../";

// Define a data class
class NameBody {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

const schema: JSONSchemaType<NameBody> = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string", nullable: true },
  },
  required: ["firstName"],
  additionalProperties: false,
};

// This is your AWS handler
async function helloWorld(event: {
  body: NameBody;
}): Promise<APIGatewayProxyResult> {
  // Thanks to the validation middleware you can be sure body is typed correctly
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      "content-type": "text",
    },
    statusCode: 200,
  };
}

// Let's add middleware to our handler, then we will be able to attach middlewares to it
export const handler = composeHandler(
  // The ajv validator return promise rejections when an errors occurs while doing a validation. The rejected errors are compatible with the error handler formats
  errorHandler(),
  // add the validator middleware
  // give a schema configuration similar to the line 35 schema object depending on your dto
  // you can also give further configurations to ajv using the options property of ajv object that the ajvValidator takes. For configuration options please visit https://ajv.js.org/options.html
  ajvValidator({ ajv: { schema } }),
  helloWorld
);
```
