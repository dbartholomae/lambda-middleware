---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/examples/hellowWorld.int-test.ts
---
import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with no sniff middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });
});
