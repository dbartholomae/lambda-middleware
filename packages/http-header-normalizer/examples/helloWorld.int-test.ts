import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with httpHeaderNormalizer middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });

  it("returns the header value for a lower-case custom-header", async () => {
    const value = "value";
    const response = await server.get("/hello").set("custom-header", value);
    expect(response.body.msg).toEqual(value);
  });

  it("returns the header value for an upper-case custom-header", async () => {
    const value = "value";
    const response = await server.get("/hello").set("Custom-Header", value);
    expect(response.body.msg).toEqual(value);
  });
});
