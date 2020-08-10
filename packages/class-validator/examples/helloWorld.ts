// When using decorators, don't forget to import this in the very first line of code
import "reflect-metadata";

import { classValidator } from "../";
import { compose } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { IsString } from "class-validator";

// Define a validator for the body via class-validator
class NameBody {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

// This is your AWS handler
async function helloWorld(event: { body: NameBody }) {
  // Thanks to the validation middleware you can be sure body is typed correctly
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      "content-type": "text",
    },
    statusCode: 200,
  };
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = compose(
  // The class validator throws validation errors from http-errors which are compatible with
  // the error handler middlewares for middy
  errorHandler(),
  classValidator({
    // Add the validation class here
    bodyType: NameBody,
  })
)(helloWorld);
