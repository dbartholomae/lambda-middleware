---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/README.md
---
# @lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2F<%= h.inflection.dasherize(name.toLowerCase()) %>.svg)](https://npmjs.org/package/@lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2F<%= h.inflection.dasherize(name.toLowerCase()) %>.svg)](https://npmjs.org/package/@lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=main)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

<%= description %>

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import { <%=h.inflection.camelize(name, true) %> } from "@lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>";
import { APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: "",
  };
}

// Wrap the handler with the middleware
export const handler = <%=h.inflection.camelize(name, true) %>()(helloWorld);
```
