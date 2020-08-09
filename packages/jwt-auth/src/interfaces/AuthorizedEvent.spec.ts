import { AuthorizedEvent, isAuthorizedEvent } from "./AuthorizedEvent";

describe("AuthorizedEvent", () => {
  describe("interface", () => {
    it("accepts data with token information set in the generics", () => {
      interface Token {
        foo: string;
      }
      const event: AuthorizedEvent<Token> = {
        auth: {
          payload: {
            foo: "",
          },
          token: "",
        },
      };
      expect(event).not.toBeNull();
    });
  });

  describe("type guard", () => {
    it(`accepts data that has a payload verified by the given type guard`, () => {
      interface Token {
        foo: string;
      }
      function isToken(token: any): token is Token {
        return token != null && typeof token.foo === "string";
      }

      expect(
        isAuthorizedEvent(
          {
            auth: {
              payload: {
                foo: "bar",
              },
              token: "",
            },
          },
          isToken
        )
      ).toBe(true);
    });

    it("rejects data that is null", () => {
      expect(isAuthorizedEvent(null)).toBe(false);
    });

    it("rejects an empty object", () => {
      expect(isAuthorizedEvent({})).toBe(false);
    });

    it("rejects data where the payload is rejected by a given type guard", () => {
      interface Token {
        foo: string;
      }
      function isToken(token: any): token is Token {
        return token != null && typeof token.foo === "string";
      }

      expect(
        isAuthorizedEvent(
          {
            auth: {},
          },
          isToken
        )
      ).toBe(false);
    });
  });
});
