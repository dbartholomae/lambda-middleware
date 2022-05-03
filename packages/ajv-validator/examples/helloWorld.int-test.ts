import request from "supertest";

const server = request("http://localhost:3000/dev");

describe("Handler with ajvValidator middleware", () => {
  describe("with valid input", () => {
    it("returns 200", async () => {
      const response = await server
        .post("/hello")
        .send({
          firstName: "John",
          lastName: "Doe",
        })
        .expect(200);
        
      expect(response.text).toEqual("Hello John Doe");
    });
  });

  describe("with invalid input", () => {
    it("returns 400", async () => {
      const response = await server
        .post("/hello")
        .send({
          lastName: "Doe",
          inject: "malicious"
        })
        .expect(400);
        
      expect(response.body).toMatchObject(
        expect.objectContaining({ statusCode: 400 })
      );
    });
  });
});
