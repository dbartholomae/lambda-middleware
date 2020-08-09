import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with no sniff middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });

  it("returns the X-Content-Type-Options header set to nosniff", async () => {
    const response = await server.get("/hello");
    expect(response.header["x-content-type-options"]).toEqual("nosniff");
  });
});
