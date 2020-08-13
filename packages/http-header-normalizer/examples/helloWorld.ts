import { httpHeaderNormalizer } from "../";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld({
  headers,
}: APIGatewayProxyEvent): APIGatewayProxyResult {
  return {
    body: JSON.stringify({
      msg: headers["custom-header"],
    }),
    statusCode: 200,
  };
}

// Wrap the handler with the middleware
export const handler = httpHeaderNormalizer()(helloWorld);
