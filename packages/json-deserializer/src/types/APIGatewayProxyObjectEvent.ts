import { APIGatewayProxyEvent } from "aws-lambda";

export type APIGatewayProxyObjectEvent<E extends APIGatewayProxyEvent> = Omit<
  E,
  "body"
> & { body: Record<string, unknown> | null };
