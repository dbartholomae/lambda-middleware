import { PromiseHandler } from "@lambda-middleware/utils";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { APIGatewayProxyObjectEvent } from "./types/APIGatewayProxyObjectEvent";
import { RequestBodyNotJsonError } from "./customErrors/RequestBodyNotJsonError";

export const jsonDeserializer = <E extends APIGatewayProxyEvent>() => (
  handler: PromiseHandler<APIGatewayProxyObjectEvent<E>, APIGatewayProxyResult>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
  const bodyObject = deserializeBody(event);
  return await handler({ ...event, bodyObject }, context);
};

const deserializeBody = <
  E extends APIGatewayProxyEvent & { body: string | null }
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
      error
    );
  }
};

const isJsonMimeType = (event: APIGatewayProxyEvent) => {
  const { headers } = event;
  const contentTypeHeader =
    headers?.["Content-Type"] ?? headers?.["content-type"];

  if (!contentTypeHeader) {
    return false;
  }

  const mimeParts = contentTypeHeader.split("/");

  if (mimeParts.length != 2) {
    return false;
  }

  const lastSubtypePart = mimeParts[1].toLowerCase().split("+").pop()?.trim();

  return lastSubtypePart === "json" || lastSubtypePart === "json;";
};
