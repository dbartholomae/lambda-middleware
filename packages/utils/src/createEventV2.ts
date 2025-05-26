import type { APIGatewayProxyEventV2 } from "aws-lambda";

export function createEventV2(
  overrides: Partial<APIGatewayProxyEventV2>
): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey: "GET /",
    rawPath: "/",
    rawQueryString: "",
    cookies: [],
    headers: {},
    queryStringParameters: {},
    requestContext: {
      accountId: "123456789012",
      apiId: "api-id",
      domainName: "id.execute-api.us-east-1.amazonaws.com",
      domainPrefix: "id",
      http: {
        method: "GET",
        path: "/",
        protocol: "HTTP/1.1",
        sourceIp: "192.0.2.1",
        userAgent: "Test Agent",
      },
      requestId: `req-${Math.random().toString(16).slice(2)}`,
      routeKey: "GET /",
      stage: "$default",
      time: new Date().toISOString(),
      timeEpoch: Math.floor(Date.now() / 1000),
    },
    isBase64Encoded: false,
    ...overrides,
  };
}
