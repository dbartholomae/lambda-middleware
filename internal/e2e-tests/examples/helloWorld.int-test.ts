import request from "supertest";

const server = request("http://localhost:3000/dev");

describe("Handler with many middlewares", () => {
  describe("with valid input", () => {
    it("returns 200", async () => {
      const response = await server
        .post("/hello")
        .send({
          firstName: "John",
          lastName: "Doe",
        })
        .expect(200);
      expect(response.body).toEqual({ message: "Hello John Doe" });
    });
  });

  describe("with invalid input", () => {
    it("returns 400 and the validation error", async () => {
      const response = await server
        .post("/hello")
        .send({
          firstName: "John",
        })
        .expect(400);
      expect(JSON.stringify(response.body)).toContain(
        "lastName must be a string"
      );
    });
  });
});
