import { cors } from "./cors";
import {
  createContext,
  createEvent,
  createEventV2,
  PromiseHandler,
} from "@lambda-middleware/utils";
import { APIGatewayProxyResult } from "aws-lambda";

describe("cors", () => {
  let response: APIGatewayProxyResult;
  let handler: PromiseHandler;

  const defaultCorsHeaders = {
    Origin: "https://example.com",
    "Access-Control-Request-Headers": "Content-Type",
  };

  const emptyResponse = {
    statusCode: 200,
    body: "",
  };

  it("throws an error with invalid config", async () => {
    // @ts-expect-error
    expect(() => cors({ cacheControl: false })).toThrowError();
  });

  describe("with an APIGatewayProxyEvent", () => {
    describe("POST request", () => {
      const apiGatewayEvent = createEvent({
        headers: defaultCorsHeaders,
        httpMethod: "POST",
      });

      describe("with default options", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(apiGatewayEvent, createContext());
        });

        it("returns the handler's response", async () => {
          expect(response).toMatchObject(emptyResponse);
        });

        it("sets Access-Control-Allow-Origin header to '*'", async () => {
          expect(response.headers!["Access-Control-Allow-Origin"]).toBe("*");
        });

        it("does not set Access-Control-Allow-Credentials header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Credentials"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Expose-Headers header", async () => {
          expect(
            response.headers!["Access-Control-Expose-Headers"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Allow-Methods header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Methods"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Allow-Headers header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Headers"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Max-Age header", async () => {
          expect(response.headers!["Access-Control-Max-Age"]).toBeUndefined();
        });
      });

      describe("with lower-case method", () => {
        const event = createEvent({
          headers: defaultCorsHeaders,
          httpMethod: "post",
        });

        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(event, createContext());
        });

        it("returns the handler's response", async () => {
          expect(response).toMatchObject(emptyResponse);
        });
      });

      describe("with allowCredentials set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowCredentials: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Credentials header to 'true'", async () => {
          expect(response.headers!["Access-Control-Allow-Credentials"]).toBe(
            "true"
          );
        });
      });

      describe("with exposedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            exposedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Expose-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Expose-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with Origin header 'https://example.com'", () => {
        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "POST",
        });

        describe("with allowedOrigin set to 'https://example.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["https://example.com"],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to /example\\.(com|org)/", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: [/example\.(com|org)/],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to 'nowhere.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["nowhere.com"],
            })(handler)(event, createContext());
          });

          it("does not set the Access-Control-Allow-Origin header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Origin"]
            ).toBeUndefined();
          });
        });
      });

      describe("with change to Vary header", () => {
        it("sets Vary to Origin when it returns Access-Control-Allow-Origin based on Origin", async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue({
            body: "",
            headers: {
              Vary: "X-Custom-Header",
            },
            statusCode: 200,
          });
          const response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(apiGatewayEvent, createContext());

          expect(response.headers!["Vary"]).toContain("Origin");
        });

        it("keeps the Vary headers returned by the handler", async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue({
            body: "",
            headers: {
              Vary: "X-Custom-Header",
            },
            statusCode: 200,
          });
          const response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(apiGatewayEvent, createContext());

          expect(response.headers!["Vary"]).toContain("X-Custom-Header");
        });
      });
    });

    describe("OPTIONS request", () => {
      const apiGatewayEvent = createEvent({
        headers: {
          Origin: "https://example.com",
          "Access-Control-Request-Headers": "Content-Type",
        },
        httpMethod: "OPTIONS",
      });

      describe("with preflightContinue set to false", () => {
        beforeEach(async () => {
          handler = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            preflightContinue: false,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("does not call the handler", async () => {
          expect(handler).not.toHaveBeenCalled();
        });

        it("returns status code 204", async () => {
          expect(response.statusCode).toBe(204);
        });

        it("returns an empty body", async () => {
          expect(response.body).toBe("");
        });

        it("sets Content-Length header to '0'", async () => {
          expect(response.headers!["Content-Length"]).toBe("0");
        });
      });

      describe.each([true, false])(
        "with default options and preflightContinue set to %s",
        (preflightContinue) => {
          beforeEach(async () => {
            handler = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({ preflightContinue })(handler)(
              apiGatewayEvent,
              createContext()
            );
          });

          it("sets Access-Control-Allow-Methods header", async () => {
            expect(response.headers!["Access-Control-Allow-Methods"]).toBe(
              "GET,HEAD,PUT,PATCH,POST,DELETE"
            );
          });

          it("mirrors Access-Control-Request-Headers to Access-Control-Allow-Headers", async () => {
            expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
              apiGatewayEvent.headers["Access-Control-Request-Headers"]
            );
          });

          it("does not set Access-Control-Max-Age header", async () => {
            expect(response.headers!["Access-Control-Max-Age"]).toBeUndefined();
          });

          it("sets Access-Control-Allow-Origin header to '*'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe("*");
          });

          it("does not set Access-Control-Allow-Credentials header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Credentials"]
            ).toBeUndefined();
          });

          it("does not set Access-Control-Expose-Headers header", async () => {
            expect(
              response.headers!["Access-Control-Expose-Headers"]
            ).toBeUndefined();
          });
        }
      );

      describe("with lower-case method", () => {
        let handler: PromiseHandler;

        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "options",
        });

        beforeEach(async () => {
          handler = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(event, createContext());
        });

        it("does not call the handler", async () => {
          expect(handler).not.toHaveBeenCalled();
        });
      });

      describe("with allowedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with allowedMethods set to ['GET', 'PUT']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedMethods: ["GET", "PUT"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets Access-Control-Allow-Methods header to 'GET,PUT'", async () => {
          expect(response.headers!["Access-Control-Allow-Methods"]).toBe(
            "GET,PUT"
          );
        });
      });

      describe("with exposedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            exposedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Expose-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Expose-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with allowCredentials set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowCredentials: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Credentials header to 'true'", async () => {
          expect(response.headers!["Access-Control-Allow-Credentials"]).toBe(
            "true"
          );
        });
      });

      describe("with optionsSuccessStatus set to 200", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            optionsSuccessStatus: 200,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("returns status code 200", async () => {
          expect(response.statusCode).toBe(200);
        });
      });

      describe("with preflightContinue set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            preflightContinue: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("returns the response of the handler", async () => {
          expect(response).toMatchObject(emptyResponse);
        });
      });

      describe("with  set to 'max-age: 300'", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            cacheControl: "max-age: 300",
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Cache-Control header to 'max-age: 300'", async () => {
          expect(response.headers!["Cache-Control"]).toBe("max-age: 300");
        });
      });

      describe("with Origin header 'https://example.com'", () => {
        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "OPTIONS",
        });

        describe("with allowedOrigin set to 'https://example.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["https://example.com"],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to /example\\.(com|org)/", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: [/example\.(com|org)/],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to 'nowhere.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["nowhere.com"],
            })(handler)(event, createContext());
          });

          it("does not set the Access-Control-Allow-Origin header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Origin"]
            ).toBeUndefined();
          });
        });
      });

      describe("with lower-cased headers in the event", () => {
        it("sets Access-Control-Allow-Headers from access-control-request-headers", async () => {
          const event = createEvent({
            headers: {
              Origin: "https://example.com",
              "access-control-request-headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          const response = await cors()(handler)(event, createContext());

          expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
            "Content-Type"
          );
        });

        it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
          const event = createEvent({
            headers: {
              origin: "https://example.com",
              "Access-Control-Request-Headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          const response = await cors({
            allowedOrigins: ["https://example.com"],
          })(handler)(event, createContext());
          expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
            "https://example.com"
          );
        });
      });

      describe("without Origin set", () => {
        beforeEach(async () => {
          const event = createEvent({
            headers: {
              "Access-Control-Request-Headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(event, createContext());
        });

        it("does not set the Access-Control-Allow-Origin header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Origin"]
          ).toBeUndefined();
        });
      });
    });
  });

  describe("with an APIGatewayProxyEventV2", () => {
    describe("POST request", () => {
      const apiGatewayEvent = createEventV2({
        requestContext: {
          http: {
            method: "POST",
          },
        },
      });

      describe("with default options", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(apiGatewayEvent, createContext());
        });

        it("returns the handler's response", async () => {
          expect(response).toMatchObject(emptyResponse);
        });

        it("sets Access-Control-Allow-Origin header to '*'", async () => {
          expect(response.headers!["Access-Control-Allow-Origin"]).toBe("*");
        });

        it("does not set Access-Control-Allow-Credentials header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Credentials"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Expose-Headers header", async () => {
          expect(
            response.headers!["Access-Control-Expose-Headers"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Allow-Methods header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Methods"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Allow-Headers header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Headers"]
          ).toBeUndefined();
        });

        it("does not set Access-Control-Max-Age header", async () => {
          expect(response.headers!["Access-Control-Max-Age"]).toBeUndefined();
        });
      });

      describe("with lower-case method", () => {
        const event = createEvent({
          headers: defaultCorsHeaders,
          httpMethod: "post",
        });

        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(event, createContext());
        });

        it("returns the handler's response", async () => {
          expect(response).toMatchObject(emptyResponse);
        });
      });

      describe("with allowCredentials set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowCredentials: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Credentials header to 'true'", async () => {
          expect(response.headers!["Access-Control-Allow-Credentials"]).toBe(
            "true"
          );
        });
      });

      describe("with exposedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            exposedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Expose-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Expose-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with Origin header 'https://example.com'", () => {
        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "POST",
        });

        describe("with allowedOrigin set to 'https://example.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["https://example.com"],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to /example\\.(com|org)/", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: [/example\.(com|org)/],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to 'nowhere.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["nowhere.com"],
            })(handler)(event, createContext());
          });

          it("does not set the Access-Control-Allow-Origin header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Origin"]
            ).toBeUndefined();
          });
        });
      });

      describe("with change to Vary header", () => {
        it("sets Vary to Origin when it returns Access-Control-Allow-Origin based on Origin", async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue({
            body: "",
            headers: {
              Vary: "X-Custom-Header",
            },
            statusCode: 200,
          });
          const response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(apiGatewayEvent, createContext());

          expect(response.headers!["Vary"]).toContain("Origin");
        });

        it("keeps the Vary headers returned by the handler", async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue({
            body: "",
            headers: {
              Vary: "X-Custom-Header",
            },
            statusCode: 200,
          });
          const response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(apiGatewayEvent, createContext());

          expect(response.headers!["Vary"]).toContain("X-Custom-Header");
        });
      });
    });

    describe("OPTIONS request", () => {
      const apiGatewayEvent = createEventV2({
        requestContext: {
          http: {
            method: "OPTIONS",
          },
        },
      });

      describe("with preflightContinue set to false", () => {
        beforeEach(async () => {
          handler = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            preflightContinue: false,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("does not call the handler", async () => {
          expect(handler).not.toHaveBeenCalled();
        });

        it("returns status code 204", async () => {
          expect(response.statusCode).toBe(204);
        });

        it("returns an empty body", async () => {
          expect(response.body).toBe("");
        });

        it("sets Content-Length header to '0'", async () => {
          expect(response.headers!["Content-Length"]).toBe("0");
        });
      });

      describe.each([true, false])(
        "with default options and preflightContinue set to %s",
        (preflightContinue) => {
          beforeEach(async () => {
            handler = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({ preflightContinue })(handler)(
              apiGatewayEvent,
              createContext()
            );
          });

          it("sets Access-Control-Allow-Methods header", async () => {
            expect(response.headers!["Access-Control-Allow-Methods"]).toBe(
              "GET,HEAD,PUT,PATCH,POST,DELETE"
            );
          });

          it("mirrors Access-Control-Request-Headers to Access-Control-Allow-Headers", async () => {
            expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
              apiGatewayEvent.headers["Access-Control-Request-Headers"]
            );
          });

          it("does not set Access-Control-Max-Age header", async () => {
            expect(response.headers!["Access-Control-Max-Age"]).toBeUndefined();
          });

          it("sets Access-Control-Allow-Origin header to '*'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe("*");
          });

          it("does not set Access-Control-Allow-Credentials header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Credentials"]
            ).toBeUndefined();
          });

          it("does not set Access-Control-Expose-Headers header", async () => {
            expect(
              response.headers!["Access-Control-Expose-Headers"]
            ).toBeUndefined();
          });
        }
      );

      describe("with lower-case method", () => {
        let handler: PromiseHandler;

        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "options",
        });

        beforeEach(async () => {
          handler = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors()(handler)(event, createContext());
        });

        it("does not call the handler", async () => {
          expect(handler).not.toHaveBeenCalled();
        });
      });

      describe("with allowedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with allowedMethods set to ['GET', 'PUT']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedMethods: ["GET", "PUT"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets Access-Control-Allow-Methods header to 'GET,PUT'", async () => {
          expect(response.headers!["Access-Control-Allow-Methods"]).toBe(
            "GET,PUT"
          );
        });
      });

      describe("with exposedHeaders set to ['X-Custom-Header']", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            exposedHeaders: ["X-Custom-Header"],
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Expose-Headers header to 'X-Custom-Header'", async () => {
          expect(response.headers!["Access-Control-Expose-Headers"]).toBe(
            "X-Custom-Header"
          );
        });
      });

      describe("with allowCredentials set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowCredentials: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Access-Control-Allow-Credentials header to 'true'", async () => {
          expect(response.headers!["Access-Control-Allow-Credentials"]).toBe(
            "true"
          );
        });
      });

      describe("with optionsSuccessStatus set to 200", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            optionsSuccessStatus: 200,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("returns status code 200", async () => {
          expect(response.statusCode).toBe(200);
        });
      });

      describe("with preflightContinue set to true", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            preflightContinue: true,
          })(handler)(apiGatewayEvent, createContext());
        });

        it("returns the response of the handler", async () => {
          expect(response).toMatchObject(emptyResponse);
        });
      });

      describe("with  set to 'max-age: 300'", () => {
        beforeEach(async () => {
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            cacheControl: "max-age: 300",
          })(handler)(apiGatewayEvent, createContext());
        });

        it("sets the Cache-Control header to 'max-age: 300'", async () => {
          expect(response.headers!["Cache-Control"]).toBe("max-age: 300");
        });
      });

      describe("with Origin header 'https://example.com'", () => {
        const event = createEvent({
          headers: {
            Origin: "https://example.com",
            "Access-Control-Request-Headers": "Content-Type",
          },
          httpMethod: "OPTIONS",
        });

        describe("with allowedOrigin set to 'https://example.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["https://example.com"],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to /example\\.(com|org)/", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: [/example\.(com|org)/],
            })(handler)(event, createContext());
          });

          it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
            expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
              "https://example.com"
            );
          });
        });

        describe("with allowedOrigin set to 'nowhere.com'", () => {
          beforeEach(async () => {
            const handler: () => Promise<
              APIGatewayProxyResult
            > = jest.fn().mockResolvedValue(emptyResponse);
            response = await cors({
              allowedOrigins: ["nowhere.com"],
            })(handler)(event, createContext());
          });

          it("does not set the Access-Control-Allow-Origin header", async () => {
            expect(
              response.headers!["Access-Control-Allow-Origin"]
            ).toBeUndefined();
          });
        });
      });

      describe("with lower-cased headers in the event", () => {
        it("sets Access-Control-Allow-Headers from access-control-request-headers", async () => {
          const event = createEvent({
            headers: {
              Origin: "https://example.com",
              "access-control-request-headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          const response = await cors()(handler)(event, createContext());

          expect(response.headers!["Access-Control-Allow-Headers"]).toBe(
            "Content-Type"
          );
        });

        it("sets the Access-Control-Allow-Origin header to 'https://example.com'", async () => {
          const event = createEvent({
            headers: {
              origin: "https://example.com",
              "Access-Control-Request-Headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          const response = await cors({
            allowedOrigins: ["https://example.com"],
          })(handler)(event, createContext());
          expect(response.headers!["Access-Control-Allow-Origin"]).toBe(
            "https://example.com"
          );
        });
      });

      describe("without Origin set", () => {
        beforeEach(async () => {
          const event = createEvent({
            headers: {
              "Access-Control-Request-Headers": "Content-Type",
            },
            httpMethod: "OPTIONS",
          });
          const handler: () => Promise<
            APIGatewayProxyResult
          > = jest.fn().mockResolvedValue(emptyResponse);
          response = await cors({
            allowedOrigins: ["https://example.com/"],
          })(handler)(event, createContext());
        });

        it("does not set the Access-Control-Allow-Origin header", async () => {
          expect(
            response.headers!["Access-Control-Allow-Origin"]
          ).toBeUndefined();
        });
      });
    });
  });
});
