---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/examples/helloWorld.ts
---
import { <%=h.inflection.camelize(name, true) %> } from "../";

// This is your AWS handler
async function helloWorld() {
  return {
    statusCode: 200,
    body: "",
  };
}

// Wrap the handler with the middleware
export const handler = <%=h.inflection.camelize(name, true) %>()(helloWorld);
