import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it("should return an empty object when both inputs are undefined", () => {
    expect(deepMerge()).toEqual({});
  });

  it("should merge simple objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    expect(deepMerge(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should perform a deep merge", () => {
    const obj1 = { a: 1, b: { x: 10, y: 20 }, d: 100 };
    const obj2 = { b: { y: 30, z: 40 }, c: 50 };
    expect(deepMerge(obj1, obj2)).toEqual({
      a: 1,
      b: { x: 10, y: 30, z: 40 },
      c: 50,
      d: 100,
    });
  });

  it("should handle new nested objects in source", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: { x: 10 } };
    expect(deepMerge(obj1, obj2)).toEqual({ a: 1, b: { x: 10 } });
  });

  it("should overwrite non-object properties", () => {
    const obj1 = { a: 1, b: "hello" };
    const obj2 = { b: "world" };
    expect(deepMerge(obj1, obj2)).toEqual({ a: 1, b: "world" });
  });

  it("should overwrite arrays, not merge them", () => {
    const obj1 = { a: [1, 2] };
    const obj2 = { a: [3, 4] };
    expect(deepMerge(obj1, obj2)).toEqual({ a: [3, 4] });
  });

  it("should handle empty objects", () => {
    expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 });
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
    expect(deepMerge({}, {})).toEqual({});
  });

  it("should not modify the original target object", () => {
    const obj1 = { a: 1, b: { x: 10 } };
    const obj2 = { b: { y: 20 } };
    deepMerge(obj1, obj2);
    expect(obj1).toEqual({ a: 1, b: { x: 10 } });
  });

  it("should correctly merge when target has a key that source doesn't", () => {
    const target = { a: 1, b: { x: 5 } };
    const source = { c: 3 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: { x: 5 }, c: 3 });
  });

  it("should correctly merge when source has a key that target doesn't", () => {
    const target = { a: 1 };
    const source = { b: { y: 6 }, c: 3 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: { y: 6 }, c: 3 });
  });

  it("should handle null and undefined values in source", () => {
    const target = { a: 1, b: "initial" };
    const sourceWithNull = { b: null };
    expect(deepMerge(target, sourceWithNull)).toEqual({ a: 1, b: null });

    const sourceWithUndefined = { b: undefined };
    expect(deepMerge(target, sourceWithUndefined)).toEqual({
      a: 1,
      b: undefined,
    });
  });
});
