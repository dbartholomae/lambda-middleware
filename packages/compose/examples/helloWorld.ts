import { Context, ProxyHandler, APIGatewayEvent } from "aws-lambda";
import { compose } from "../";
import { PromiseHandler } from "../src/PromiseHandler";

// This is your AWS handler
async function helloWorld(): Promise<object> {
  return {
    message: "Hello world!",
  };
}

// Write your own middleware

const stringifyToBody = () => (
  handler: PromiseHandler<APIGatewayEvent, object>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handler(event, context);
  return {
    body: JSON.stringify(response),
  };
};

const addStatusCode = (statusCode: number) => (
  handler: PromiseHandler<APIGatewayEvent, { body: string }>
) => async (event: APIGatewayEvent, context: Context) => {
  const response = await handler(event, context);
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
