import { PromiseHandler } from '@lambda-middleware/utils'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda'
import debugFactory, { IDebugger } from 'debug'
import { serializeError } from 'serialize-error'
import { omit } from './helpers/omit'
import { isErrorWithStatusCode } from './interfaces/ErrorWithStatusCode'

const logger: IDebugger = debugFactory('@lambda-middleware/error-handler')

export const errorHandler = () => <E extends APIGatewayProxyEvent>(
  handler: PromiseHandler<E, APIGatewayProxyResult>
): PromiseHandler<E, APIGatewayProxyResult> => async (
  event: E,
  context: Context
) => {
  try {
    return await handler(event, context)
  } catch (error) {
    if (isErrorWithStatusCode(error) && error.statusCode < 500) {
      logger(`Responding with full error as statusCode is ${error.statusCode}`)
      return {
        body: JSON.stringify(omit(['stack'], serializeError(error))),
        statusCode: error.statusCode
      }
    }
    logger('Responding with internal server error')
    return {
      body: JSON.stringify({
        message: 'Internal server error',
        statusCode: 500
      }),
      statusCode: 500
    }
  }
}
