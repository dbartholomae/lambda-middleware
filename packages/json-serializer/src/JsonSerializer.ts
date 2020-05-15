import debugFactory, { IDebugger } from 'debug'
import { APIGatewayProxyResult } from 'aws-lambda'

const logger: IDebugger = debugFactory('@lambda-middleware/json-serializer')

export const jsonSerializer = () => (handler: any) => async (event: any, context: any): Promise<APIGatewayProxyResult> => {
  logger('')
  const response = await handler(event, context)
  if (response === undefined) {
    return {
      statusCode: 204,
      body: ''
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
