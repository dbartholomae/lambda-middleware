# @lambda-middleware/json-serializer

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fjson-serializer.svg)](https://npmjs.org/package/@lambda-middleware/json-serializer)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fjson-serializer.svg)](https://npmjs.org/package/@lambda-middleware/json-serializer)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A middleware for AWS http lambda functions to serialize JSON responses, including correct status codes and content-header.

Please note that this middleware just uses `JSON.stringify` for serialization and therefore does **not** strip any serializable content.
Please act as if any data your handler returns could end up on the client side and take care of appropriate whitelisting in the handler or a different middleware!

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { jsonSerializer } from "@lambda-middleware/json-serializer";

// This is your AWS handler
async function helloWorld() {
  return {};
}

// Wrap the handler with the middleware
export const handler = jsonSerializer()(helloWorld);
```
