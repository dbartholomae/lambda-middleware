---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/test/handler.ts
---
export { handler as fullExample } from "../examples/helloWorld";

export async function status() {
  return {
    body: "",
    statusCode: 200,
  };
}
