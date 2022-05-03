import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { JSONSchemaType } from "ajv";
import { APIGatewayProxyResult } from "aws-lambda";
import { ajvValidator } from "../";

class NameBody {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

const schema: JSONSchemaType<NameBody> = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string", nullable: true },
  },
  required: ["firstName"],
  additionalProperties: false,
};

// This is your AWS handler
async function helloWorld(event: {
  body: NameBody;
}): Promise<APIGatewayProxyResult> {
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      "content-type": "text",
    },
    statusCode: 200,
  };
}

// Wrap the handler with the middleware
export const handler = composeHandler(
  errorHandler(),
  ajvValidator({ ajv: { schema } }),
  helloWorld
);
