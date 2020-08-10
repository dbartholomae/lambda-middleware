import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with middy adaptor middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });

  it('sets the Custom-Test-After-Header header to "set"', async () => {
    const response = await server.get("/hello");
    expect(response.header["custom-test-after-header"]).toEqual("set");
  });

  it('sets the Custom-Test-On-Error-Header header to "set" if the throw-error header was set', async () => {
    const response = await server.get("/hello").set("throw-error", "true");
    expect(response.header["custom-test-on-error-header"]).toEqual("set");
  });
});
