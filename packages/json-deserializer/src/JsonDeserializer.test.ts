import { jsonDeserializer } from "./JsonDeserializer";
import { createContext, createEvent } from "@lambda-middleware/utils";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "./types/APIGatewayProxyObjectEvent";

describe("jsonDeserializer", () => {
  let processedEvent: APIGatewayProxyObjectEvent<APIGatewayProxyEvent>;

  const dummyHandler = async (
    event: APIGatewayProxyObjectEvent<APIGatewayProxyEvent>
  ) => {
    processedEvent = event;
    return {} as APIGatewayProxyResult;
  };
  const handlerWithMiddleware = jsonDeserializer()(dummyHandler);

  const testObject = {
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

  it("deserializes objects if the event has a json content-type header", async () => {
    const event: APIGatewayProxyEvent = createEvent({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testObject),
    });

    await handlerWithMiddleware(event, createContext());
    expect(processedEvent.bodyObject).toMatchObject(
      JSON.parse(JSON.stringify(testObject))
    );
  });

  describe("sets the request bodyObject to null if:", () => {
    it.each([
      ["null headers", null],
      ["null content type", { "Content-Type": null }],
      ["a non-json content-type header", { "Content-Type": "text/plain" }],
    ])("the event has %s", async (_: string, headers: any) => {
      const event = createEvent({
        headers,
        body: JSON.stringify(testObject),
      });

      await handlerWithMiddleware(event, createContext());
      expect(processedEvent.bodyObject).toBeNull();
    });
  });

  it("decodes the request body before deserializing if isBase64Encoded is true", async () => {
    const event = createEvent({
      headers: { "Content-Type": "application/json" },
      body: Buffer.from(JSON.stringify(testObject)).toString("base64"),
      isBase64Encoded: true,
    });

    await handlerWithMiddleware(event, createContext());
    expect(processedEvent.bodyObject).toMatchObject(
      JSON.parse(JSON.stringify(testObject))
    );
  });

  it("leaves the request body as null if body is null", async () => {
    const event = createEvent({
      headers: { "Content-Type": "application/json" },
      body: null,
    });

    await handlerWithMiddleware(event, createContext());
    expect(processedEvent.bodyObject).toBeNull();
  });

  it("throws a RequestBodyNotJsonError if the request body cannot deserialize", async () => {
    const event = createEvent({
      headers: { "Content-Type": "application/json" },
      body: "{thisisntvalidJson",
    });

    expect(() =>
      handlerWithMiddleware(event, createContext())
    ).rejects.toMatchObject({
      name: "RequestBodyNotJsonError",
      message:
        "Content-Type header specified JSON but the body is not valid JSON!",
      body: "{thisisntvalidJson",
    });
  });
});
