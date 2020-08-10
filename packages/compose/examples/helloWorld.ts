import { compose } from "../";
import { PromiseHandler } from "@lambda-middleware/utils";
import { Context, ProxyHandler, APIGatewayEvent } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<object> {
  return {
    message: "Hello world!",
  };
}

// Write your own middleware
const stringifyToBody = () => (
  handle: PromiseHandler<APIGatewayEvent, object>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handle(event, context);
  return {
    body: JSON.stringify(response),
  };
};

const addStatusCode = (statusCode: number) => (
  handle: PromiseHandler<APIGatewayEvent, { body: string }>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handle(event, context);
  return {
    ...response,
    statusCode,
  };
};

// Wrap the handler with the middleware.
// With compose you can wrap multiple middlewares around one handler.
export const handler: ProxyHandler = compose(
  addStatusCode(200),
  stringifyToBody()
)(helloWorld);
