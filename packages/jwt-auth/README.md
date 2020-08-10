# @lambda-middleware/jwt-auth

[![npm version](https://badge.fury.io/js/%40lambda-middleware%2Fjwt-auth.svg)](https://npmjs.org/package/@lambda-middleware/jwt-auth)
[![downloads](https://img.shields.io/npm/dw/%40lambda-middleware%2Fjwt-auth.svg)](https://npmjs.org/package/@lambda-middleware/jwt-auth)
[![open issues](https://img.shields.io/github/issues-raw/dbartholomae/lambda-middleware.svg)](https://github.com/dbartholomae/lambda-middleware/issues)
[![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)
[![build status](https://github.com/dbartholomae/lambda-middleware/workflows/.github/workflows/build.yml/badge.svg?branch=master)](https://github.com/dbartholomae/lambda-middleware/actions?query=workflow%3A.github%2Fworkflows%2Fbuild.yml)
[![codecov](https://codecov.io/gh/dbartholomae/lambda-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/lambda-middleware)
[![dependency status](https://david-dm.org/dbartholomae/lambda-middleware.svg?theme=shields.io)](https://david-dm.org/dbartholomae/lambda-middleware)
[![devDependency status](https://david-dm.org/dbartholomae/lambda-middleware/dev-status.svg)](https://david-dm.org/dbartholomae/lambda-middleware?type=dev)

A middleware for AWS http lambda functions to verify JWT auth tokens inspired by [express-jwt](https://github.com/auth0/express-jwt).

## Lambda middleware

This middleware is part of the [lambda middleware series](https://dbartholomae.github.io/lambda-middleware/). It can be used independently.

## Usage

```typescript
import {
  jwtAuth,
  EncryptionAlgorithms,
  AuthorizedEvent,
} from "@lambda-middleware/jwt-auth";
import { compose } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import createHttpError from "http-errors";

interface TokenPayload {
  permissions: string[];
}

function isTokenPayload(token: any): token is TokenPayload {
  return (
    token != null &&
    Array.isArray(token.permissions) &&
    token.permissions.every((permission: any) => typeof permission === "string")
  );
}

// This is your AWS handler
const helloWorld = async (event: AuthorizedEvent<TokenPayload>) => {
  // The middleware adds auth information if a valid token was added
  // If no auth was found and credentialsRequired is set to true, a 401 will be thrown. If auth exists you
  // have to check that it has the expected form.
  if (event.auth!.payload.permissions.indexOf("helloWorld") === -1) {
    throw createHttpError(
      403,
      `User not authorized for helloWorld, only found permissions [${event.auth!.payload.permissions.join(
        ", "
      )}]`,
      {
        type: "NotAuthorized",
      }
    );
  }

  return {
    body: JSON.stringify({
      data: `Hello world! Here's your token: ${event.auth!.token}`,
    }),
    statusCode: 200,
  };
};

export const handler = compose(
  errorHandler(),
  jwtAuth({
    /** Algorithm to verify JSON web token signature */
    algorithm: EncryptionAlgorithms.HS256,
    /** An optional boolean that enables making authorization mandatory */
    credentialsRequired: true,
    /** An optional function that checks whether the token payload is formatted correctly */
    isPayload: isTokenPayload,
    /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
    secretOrPublicKey: "secret",
    /**
     * An optional function used to search for a token e. g. in a query string. By default, and as a fall back,
     * event.headers.authorization and event.headers.Authorization are used.
     */
    tokenSource: (event: any) => event.queryStringParameters.token,
  })
)(helloWorld);
```

Please note that there is some TypeScript magic going on that checks if
`credentialsRequired` is set to true, and if it isn't, will check that your handler
does not require on `event.auth` being set. Unfortunately this means that if you
define options as a variable before handing them into the middleware, you have
to define them `const options = { ... } as const` so TypeScript reads
`credentialsRequired` as `true` instead of expanding the type to `boolean`.

If you directly hand in the options to the middleware, this should not be
snecessary.
