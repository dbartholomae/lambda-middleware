import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with frameguard middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });

  it("returns the X-Frame-Options header set to SAMEORIGIN", async () => {
    const response = await server.get("/hello");
    expect(response.header["x-frame-options"]).toEqual("SAMEORIGIN");
  });
});
