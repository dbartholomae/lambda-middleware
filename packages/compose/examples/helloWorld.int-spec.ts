import request from "supertest";

const server = request("http://localhost:3000/dev");

describe('Handler with composed middleware', () => {
  it("returns 200 and a stringified body", async () => {
    const response = await server.get("/hello").expect(200);
    expect(response.body.message).toEqual("Hello world!");
  });
})
