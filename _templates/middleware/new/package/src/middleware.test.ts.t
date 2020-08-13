---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/src/<%=h.inflection.camelize(name, true) %>.test.ts
---
import { <%=h.inflection.camelize(name, true) %> } from "./<%=h.inflection.camelize(name, true) %>";
import { createEvent, createContext } from "@lambda-middleware/utils";

describe("<%=h.inflection.camelize(name, true) %>", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(await <%=h.inflection.camelize(name, true) %>()(handler)(
      createEvent({}), createContext()
    ).toMatchObject(
      response
    );
  });
});
