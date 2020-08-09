import { compose } from "./compose";

describe("compose", () => {
  describe("with no arguments", () => {
    it("throws a TypeError if called without any arguments", () => {
      expect(() => (compose as any)()).toThrow(
        new TypeError("compose requires at least one argument")
      );
    });
  });

  describe("with multiple arguments", () => {
    it("calls the right-most function with the compose parameters", () => {
      const functions = [
        jest.fn().mockReturnValue(1),
        jest.fn().mockReturnValue(2),
        jest.fn().mockReturnValue(3),
      ];
      compose(functions[2], functions[1], functions[0])(0, "second parameter");
      expect(functions[0]).toHaveBeenCalledWith(0, "second parameter");
    });

    it.each([1, 2])(
      "calls the %ss function with the previous functions return value",
      async (n) => {
        const functions = [
          jest.fn().mockReturnValue(1),
          jest.fn().mockReturnValue(2),
          jest.fn().mockReturnValue(3),
        ];
        compose(
          functions[2],
          functions[1],
          functions[0]
        )(0, "second parameter");
        expect(functions[n]).toHaveBeenCalledWith(n);
      }
    );

    it("returns the return value of the left-most function", async () => {
      const functions = [
        jest.fn().mockReturnValue(1),
        jest.fn().mockReturnValue(2),
        jest.fn().mockReturnValue(3),
      ];
      const returnValue = compose(
        functions[2],
        functions[1],
        functions[0]
      )(0, "second parameter");
      expect(returnValue).toEqual(3);
    });
  });
});
