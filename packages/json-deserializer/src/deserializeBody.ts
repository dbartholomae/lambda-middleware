import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import { isJsonMimeType } from "./IsJsonMimeType";
import { RequestBodyNotJsonError } from "./customErrors/RequestBodyNotJsonError";

export const deserializeBody = <
  E extends (APIGatewayProxyEvent | APIGatewayProxyEventV2) & {
    body: string | null;
  }
>(
  event: E
): Record<string, unknown> | null => {
  const { body, isBase64Encoded } = event;

  if (!body || !isJsonMimeType(event)) {
    return null;
  }

  const data = isBase64Encoded ? Buffer.from(body, "base64").toString() : body;

  try {
    return JSON.parse(data);
  } catch (error) {
    throw new RequestBodyNotJsonError(
      "Content-Type header specified JSON but the body is not valid JSON!",
      body,
      error as Error
    );
  }
};
