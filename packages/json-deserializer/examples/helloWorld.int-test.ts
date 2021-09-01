import request from "supertest";
const server = request("http://localhost:3000/dev");

describe("Handler with json deserializer middleware", () => {
  const testRequestBody = {
    a: "json",
    object: {
      with: ["multiple", "types"],
      ofProperties: {
        numbers: 2345,
        booleans: true,
        stringValues: "testString",
        nulls: null,
        undefineds: undefined,
        andArrays: ["ofStrings", 42, null],
      },
    },
  };

  it("returns 200", async () => {
    await server
      .post("/hello")
      .send(JSON.stringify(testRequestBody))
      .set("Content-Type", "application/json")
      .expect(200);
  });

  it("passes the JSON payload as an object allowing the JSON response to be built", async () => {
    const response = await server
      .post("/hello")
      .send(JSON.stringify(testRequestBody))
      .set("Content-Type", "application/json");
    expect(response.body).toEqual({
      a: "json",
      additionalThing: "addedInHandler",
      object: {
        ofProperties: {
          andArrays: ["ofStrings", 42, null],
          booleans: true,
          nulls: null,
          numbers: 2345,
          stringValues: "testString",
        },
        with: ["multiple", "types"],
      },
    });
  });
});
