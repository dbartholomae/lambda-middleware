import debugFactory, { IDebugger } from 'debug'
import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { PromiseHandler } from './interfaces/PromiseHandler'

const logger: IDebugger = debugFactory('@lambda-middleware/no-sniff')

export const noSniff = <E>() => (
  handler: PromiseHandler<E, APIGatewayProxyResult>
) => async (event: E, context: Context): Promise<APIGatewayProxyResult> => {
  logger('Running handler')
  const response = await handler(event, context)
  return {
    ...response,
    headers: { ...response.headers, 'X-Content-Type-Options': 'nosniff' }
  }
}
