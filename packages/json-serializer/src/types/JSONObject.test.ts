import { JSONObject } from "./JSONObject";

describe("JSONObject", () => {
  it("accepts an empty object", async () => {
    const json: JSONObject = {};
    expect(json).toBeDefined();
  });

  it("accepts an object with a string", async () => {
    const json: JSONObject = {
      foo: "bar",
    };
    expect(json).toBeDefined();
  });

  it("accepts an object with null", async () => {
    const json: JSONObject = {
      foo: null,
    };
    expect(json).toBeDefined();
  });

  it("accepts an object with a boolean", async () => {
    const json: JSONObject = {
      foo: true,
    };
    expect(json).toBeDefined();
  });

  it("accepts an object with a number", async () => {
    const json: JSONObject = {
      foo: 1,
    };
    expect(json).toBeDefined();
  });

  it("accepts an object with another object", async () => {
    const json: JSONObject = {
      foo: {
        bar: 2,
      },
    };
    expect(json).toBeDefined();
  });

  it("rejects a function", async () => {
    // @ts-expect-error
    const json: JSONObject = () => null;
    expect(json).toBeDefined();
  });

  it("rejects an object with a function", async () => {
    const json: JSONObject = {
      // @ts-expect-error
      foo: () => null,
    };
    expect(json).toBeDefined();
  });

  it("accepts an array", async () => {
    const json: JSONObject = [];
    expect(json).toBeDefined();
  });

  it("accepts an object with an array", async () => {
    const json: JSONObject = {
      foo: [],
    };
    expect(json).toBeDefined();
  });
});
