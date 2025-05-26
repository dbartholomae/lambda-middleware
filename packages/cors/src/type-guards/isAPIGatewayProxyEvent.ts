import { isNil } from "./isNil";
import { isString } from "./isString";
import { APIGatewayEvent } from "aws-lambda";

export function isAPIGatewayProxyEvent(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  event: any
): event is APIGatewayEvent {
  return !isNil(event) && isString(event.httpMethod);
}
