import "reflect-metadata";

import { classValidator } from "@lambda-middleware/class-validator";
import { composeHandler } from "@lambda-middleware/compose";
import { cors } from "@lambda-middleware/cors";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { jsonSerializer } from "@lambda-middleware/json-serializer";
import { EncryptionAlgorithms, jwtAuth } from "@lambda-middleware/jwt-auth";

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
async function helloWorld(event: {
  body: NameBody;
}): Promise<{ message: string }> {
  // Thanks to the validation middleware you can be sure body is typed correctly
  return {
    message: `Hello ${event.body.firstName} ${event.body.lastName}`,
  };
}

export const handler = composeHandler(
  // add cors headers last so even error responses from the
  // errorHandler middleware have cors headers applied
  cors(),

  // errorHandler is next so errors from all other middlewares are caught
  errorHandler(),

  // jwtAuth needs to be before jsonSerializer as it already returns
  // a serialized response
  jwtAuth({
    algorithm: EncryptionAlgorithms.HS256,
    secretOrPublicKey: "secret",
  }),

  // jsonSerializer needs to be below all middlewares that handle APIGatewayResponses
  jsonSerializer(),

  // classValidator should be last as it replaces the body of the event
  // and other middlewares might not be able to handle the modified event
  classValidator({
    bodyType: NameBody,
  }),
  helloWorld
);
