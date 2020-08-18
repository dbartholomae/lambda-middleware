# @lambda-middleware/no-sniff

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fno-sniff.svg)](https://npmjs.org/package/@lambda-middleware/no-sniff)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fno-sniff.svg)](https://npmjs.org/package/@lambda-middleware/no-sniff)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A middleware for adding the [content type options no-sniff header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) to AWS lambdas.

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { noSniff } from "@lambda-middleware/no-sniff";

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
