import { middyAdaptor, MiddlewareObject } from "../";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (event.headers["before-middleware-ran"] === undefined) {
    throw new Error("Before middleware never ran");
  }
  if (event.headers["throw-error"] !== undefined) {
    throw new Error("Throw-error header is set");
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: "Hello World" }),
  };
}

// Import an existing middy middleware or write your own
function customMiddyMiddleware(): MiddlewareObject<any, any> {
  function createCustomHeaderAdder(headerName: string, headerValue: string) {
    return (
      instance: { response: any; error: Error | null },
      next: (error?: any) => void
    ): void => {
      instance.response = instance.response ?? { statusCode: 200 };
      instance.response.headers = instance.response.headers ?? {};
      instance.response.headers[headerName] = headerValue;
      next();
    };
  }

  return {
    before: async (instance: { event: any }): Promise<void> => {
      instance.event.headers = {
        ...instance.event.headers,
        "before-middleware-ran": "true",
      };
    },
    after: createCustomHeaderAdder("Custom-Test-After-Header", "set"),
    onError: createCustomHeaderAdder("Custom-Test-On-Error-Header", "set"),
  };
}

// Wrap the handler with the middleware
export const handler = middyAdaptor(customMiddyMiddleware())(helloWorld);
