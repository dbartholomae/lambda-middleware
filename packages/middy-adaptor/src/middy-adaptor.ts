// import debugFactory, { IDebugger } from 'debug'
import { PromiseHandler } from '@lambda-middleware/utils'
import { Context } from 'aws-lambda'
import {
  Instance,
  MiddlewareObject,
  PromisifiedMiddlewareObject
} from './interfaces/MiddyTypes'
import { promisifyMiddyMiddleware } from './utils/promisifyMiddyMiddleware'

// const logger: IDebugger = debugFactory('@lambda-middleware/no-sniff')

export const middyAdaptor = <Event>(
  middyMiddleware: MiddlewareObject<unknown, unknown>
) => (handler: PromiseHandler<Event, unknown>) => async (
  event: Event,
  context: Context
) => {
  let callbackCalled = false
  let callbackError: unknown = undefined
  let callbackResponse: unknown = undefined

  const callback = (error: unknown, result: unknown) => {
    callbackCalled = true
    callbackError = error
    callbackResponse = result
  }
  const instance: Instance = {
    context: { ...context },
    event: { ...event },
    response: null,
    error: null,
    callback
  }

  const promisifiedMiddyMiddleware: PromisifiedMiddlewareObject = {}

  for (const key in middyMiddleware) {
    promisifiedMiddyMiddleware[key] = promisifyMiddyMiddleware(
      middyMiddleware[key]
    )
  }

  if (promisifiedMiddyMiddleware.before !== undefined) {
    await promisifiedMiddyMiddleware.before(instance)
    if (callbackCalled) {
      if (callbackError) {
        throw callbackError
      }
      return callbackResponse
    }
  }
  try {
    instance.response = await handler(instance.event, context)
    if (promisifiedMiddyMiddleware.after !== undefined) {
      await promisifiedMiddyMiddleware.after(instance)
    }
  } catch (error) {
    instance.error = error
    let newError = error
    if (promisifiedMiddyMiddleware.onError !== undefined) {
      newError = await promisifiedMiddyMiddleware.onError(instance)
    }
    if (newError) {
      throw newError
    }
  }
  if (callbackCalled) {
    if (callbackError) {
      throw callbackError
    }
    return callbackResponse
  }
  return instance.response
}
