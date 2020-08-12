---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/examples/helloWorld.int-test.ts
---
import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with <%= h.inflection.dasherize(name) %> middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });
});
