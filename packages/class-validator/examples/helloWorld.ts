// When using decorators, don't forget to import this in the very first line of code
import "reflect-metadata";

import { classValidator } from "../";
import { compose } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { IsString } from "class-validator";
import { APIGatewayProxyResult } from "aws-lambda";

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
}): Promise<APIGatewayProxyResult> {
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
export const handler = compose(
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
  (x: typeof helloWorld): typeof helloWorld => x
)(helloWorld);
