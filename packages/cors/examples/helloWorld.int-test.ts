import request, { Response } from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with cors middleware", () => {
  it("returns 200", async () => {
    await server.get("/hello").expect(200);
  });

  describe("OPTIONS request", () => {
    let response: Readonly<Response>;

    beforeAll(async () => {
      response = await server
        .options("/hello")
        .redirects(1)
        .set("Origin", "https://example.com")
        .set("Access-Control-Request-Method", "POST");
    });

    it("sets the access-control-allow-origin header to 'https://example.com'", async () => {
      expect(response.header["access-control-allow-origin"]).toBe(
        "https://example.com"
      );
    });

    it("sets the access-control-allow-credentials header to true", async () => {
      expect(response.header["access-control-allow-credentials"]).toBe("true");
    });

    it("sets the access-control-allow-methods header to 'POST'", async () => {
      expect(response.header["access-control-allow-methods"]).toBe("POST");
    });
  });

  describe("POST request", () => {
    let response: Readonly<Response>;

    beforeAll(async () => {
      response = await server
        .post("/hello")
        .set("origin", "https://example.com");
    });

    it("sets the access-control-allow-origin header to 'https://example.com'", async () => {
      expect(response.header["access-control-allow-origin"]).toBe(
        "https://example.com"
      );
    });

    it("sets the access-control-allow-credentials header to true", async () => {
      expect(response.header["access-control-allow-credentials"]).toBe("true");
    });

    it("sets the vary header to 'origin'", async () => {
      expect(response.header["vary"]).toContain("origin");
    });
  });
});
