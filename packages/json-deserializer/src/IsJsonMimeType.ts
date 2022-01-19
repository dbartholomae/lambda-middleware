import { APIGatewayProxyEvent } from "aws-lambda";

export const isJsonMimeType = (event: APIGatewayProxyEvent): boolean => {
  const { headers } = event;
  const contentTypeHeader =
    headers?.["Content-Type"] ?? headers?.["content-type"] ?? "";
  return (
    contentTypeHeader.startsWith("application/json") ||
    contentTypeHeader.startsWith("application/ld+json")
  );
};
