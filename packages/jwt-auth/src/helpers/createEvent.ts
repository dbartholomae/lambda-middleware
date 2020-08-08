import { APIGatewayEvent } from 'aws-lambda'

export function createEvent(
  overrides: Partial<APIGatewayEvent>
): APIGatewayEvent {
  return {
    headers: {},
    body: '',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: '',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as any,
    resource: '',
    stageVariables: null,
    httpMethod: 'GET',
    ...overrides
  }
}
