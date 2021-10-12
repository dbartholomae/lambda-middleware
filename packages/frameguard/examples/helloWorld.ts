import { frameguard } from "../";
import { APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: "{}",
  };
}

// Wrap the handler with the middleware
export const handler = frameguard()(helloWorld);
