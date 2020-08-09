# @lambda-middleware/class-validator

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fclass-validator.svg)](https://npmjs.org/package/@lambda-middleware/class-validator) [![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fclass-validator.svg)](https://npmjs.org/package/@lambda-middleware/class-validator) [![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware?ref=badge_shield) [![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme) [![build status](https://img.shields.io/circleci/project/github/dbartholomae/lambda-middleware/master.svg?style=flat)](https://circleci.com/gh/dbartholomae/workflows/lambda-middleware/tree/master) [![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware) [![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware) [![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev) [![Greenkeeper](https://badges.greenkeeper.io/dbartholomae/lambda-middleware.svg)](https://greenkeeper.io/) [![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release#badge)

A middleware for AWS http lambda functions to serialize JSON responses, including correct status codes and content-header.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
// When using decorators, don't forget to import this in the very first line of code
import 'reflect-metadata'

import { classValidator } from '@lambda-middleware/class-validator'

import { compose } from '@lambda-middleware/compose'
import { errorHandler } from '@lambda-middleware/http-error-handler'
import { IsString } from 'class-validator'

// Define a validator for the body via class-validator
class NameBody {
  @IsString()
  public firstName: string

  @IsString()
  public lastName: string
}

// This is your AWS handler
async function helloWorld(event: { body: NameBody }) {
  // Thanks to the validation middleware you can be sure body is typed correctly
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      'content-type': 'text'
    },
    statusCode: 200
  }
}

export const handler = compose(
  // The class validator throws validation errors from http-errors which are compatible with
  // the error handler middlewares for middy
  errorHandler(),
  classValidator({
    // Add the validation class here
    classType: NameBody
  })
)(helloWorld)
```
