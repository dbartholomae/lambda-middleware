---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/examples/helloWorld.ts
---
import { <%=h.inflection.camelize(name, true) %> } from "../";
import { APIGatewayProxyResult } from "aws-lambda";

// This is your AWS handler
async function helloWorld(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: "",
  };
}

// Wrap the handler with the middleware
export const handler = <%=h.inflection.camelize(name, true) %>()(helloWorld);
