# @lambda-middleware/class-validator

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fclass-validator.svg)](https://npmjs.org/package/@lambda-middleware/class-validator)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fclass-validator.svg)](https://npmjs.org/package/@lambda-middleware/class-validator)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A validation middleware for AWS http lambda functions based on [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer).

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
// When using decorators, don't forget to import this in the very first line of code
import "reflect-metadata";

import { classValidator } from '@lambda-middleware/class-validator'
import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { IsString } from "class-validator";

// Define a validator for the body via class-validator
class NameBody {
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

// This is your AWS handler
async function helloWorld(event: { body: NameBody }) {
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
  // The class validator throws validation errors from http-errors which are compatible with
  // the error handler middlewares for middy
  errorHandler(),
  classValidator({
    // Add the validation class here
    bodyType: NameBody,
    // You can add options to class-transformer. These will be passed through,
    // so read the class-transformer documentation for details
    transformer: {},
    // You can add options to class-validator. For security reasons,
    // whitelist by default is set to true. If you set any options, you have
    // to set it to true manually as the default for class-validator would be
    // false
    validator: {},
  }),
  helloWorld
);
```
