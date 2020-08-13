---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/src/<%=h.inflection.camelize(name, true) %>.ts
---
import { PromiseHandler } from "@lambda-middleware/utils";
import { Context } from "aws-lambda";
import { logger } from "./logger";

export const <%=h.inflection.camelize(name, true) %> = <Event, Response>() => (
  handler: PromiseHandler<Event, Response>
) => async (event: Event, context: Context): Promise<Response> => {
  logger("Running handler");
  return handler(event, context);
};
