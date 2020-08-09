# @lambda-middleware/utils

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Futils.svg)](https://npmjs.org/package/@lambda-middleware/utils) [![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Futils.svg)](https://npmjs.org/package/@lambda-middleware/utils) [![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdbartholomae%2Flambda-middleware?ref=badge_shield) [![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme) [![build status](https://img.shields.io/circleci/project/github/dbartholomae/lambda-middleware/master.svg?style=flat)](https://circleci.com/gh/dbartholomae/workflows/lambda-middleware/tree/master) [![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware) [![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware) [![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev) [![Greenkeeper](https://badges.greenkeeper.io/dbartholomae/lambda-middleware.svg)](https://greenkeeper.io/) [![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release#badge)

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
