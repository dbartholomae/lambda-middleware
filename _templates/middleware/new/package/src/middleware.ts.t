---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/src/<%=h.inflection.camelize(name, true) %>.ts
---
import { PromiseHandler } from "@lambda-middleware/utils";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import { logger } from "./logger";

export const <%=h.inflection.camelize(name, true) %> = <E>() => (
  handler: PromiseHandler<E, APIGatewayProxyResult>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
  logger("Running handler");
  const response = await handler(event, context);
  return response;
};
