# @lambda-middleware/error-handler
 [![npm version](https://badge.fury.io/js/%40lambda-middleware%2Ferror-handler.svg)](https://npmjs.org/package/@lambda-middleware/error-handler)  [![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Ferror-handler.svg)](https://npmjs.org/package/@lambda-middleware/error-handler)  [![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)  [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware?ref=badge_shield) [![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)  [![build status](https://img.shields.io/circleci/project/github/dbartholomae/lambda-middleware/master.svg?style=flat)](https://circleci.com/gh/dbartholomae/workflows/lambda-middleware/tree/master)  [![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)  [![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)  [![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)  [![Greenkeeper](https://badges.greenkeeper.io/dbartholomae/lambda-middleware.svg)](https://greenkeeper.io/)  [![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release#badge)

An error handler middleware for AWS http lambda functions, compatible with [http-errors](https://www.npmjs.com/package/http-errors).

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { errorHandler } from '@lambda-middleware/errorHandler'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'

// This is your AWS handler
async function helloWorld (event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.search == null) {
    // If you throw an error with status code, the error will be returned as stringified JSON
    // Only the stack will be omitted.
    throw createHttpError(400, 'Query has to include a search')
  }

  // If you throw an error with no status code, only a generic message will be shown to the user
  // instead of the full error
  throw new Error('Search is not implemented yet')
}

// Wrap the handler with the middleware
export const handler = errorHandler()(helloWorld)

```
