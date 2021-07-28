import { APIGatewayProxyEvent } from "aws-lambda";

export type APIGatewayProxyObjectEvent<E extends APIGatewayProxyEvent> = E & {
  bodyObject: Record<string, unknown> | null;
};
