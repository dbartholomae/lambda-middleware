import { composeHandler } from "@lambda-middleware/compose";
import { errorHandler } from "@lambda-middleware/http-error-handler";
import { Type } from "@sinclair/typebox";
import { typeboxValidator } from "../src/typeboxValidator";
import { APIGatewayProxyResult } from "aws-lambda";

const NameBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
});

type NameBody = {
  firstName: string;
  lastName: string;
};

async function helloWorld(event: { body: NameBody }): Promise<APIGatewayProxyResult> {
  return {
    body: `Hello ${event.body.firstName} ${event.body.lastName}`,
    headers: {
      "content-type": "text",
    },
    statusCode: 200,
  };
}

export const handler = composeHandler(
  errorHandler(),
  typeboxValidator(NameBodySchema),
  helloWorld
);
