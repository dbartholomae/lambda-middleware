import debugFactory, { IDebugger } from 'debug'
import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { PromiseHandler } from './interfaces/PromiseHandler'

const logger: IDebugger = debugFactory('@lambda-middleware/json-serializer')

export const jsonSerializer = <E>() => (handler: PromiseHandler<E, any>) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
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
