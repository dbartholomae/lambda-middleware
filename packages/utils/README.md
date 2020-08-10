# @lambda-middleware/utils

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Futils.svg)](https://npmjs.org/package/@lambda-middleware/utils)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Futils.svg)](https://npmjs.org/package/@lambda-middleware/utils)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A collection of utilities for middleware for AWS lambda functions.

## Lambda middleware

These utilities are part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). They can be used independently.

## Usage

```typescript
import { noSniff } from "@lambda-middleware/utils";

// This is your AWS handler
async function helloWorld() {
  return {
    statusCode: 200,
    body: "",
  };
}

// Wrap the handler with the middleware
export const handler = noSniff()(helloWorld);
```
