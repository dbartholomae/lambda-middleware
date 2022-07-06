import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

export const isJsonMimeType = (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2
): boolean => {
  const { headers } = event;
  const contentTypeHeader =
    headers?.["Content-Type"] ?? headers?.["content-type"] ?? "";
  return (
    contentTypeHeader.startsWith("application/json") ||
    contentTypeHeader.startsWith("application/ld+json")
  );
};
