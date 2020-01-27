import { errorHandler } from './ErrorHandler'

import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import createHttpError from 'http-errors'

describe('errorHandler', () => {
  describe('without error', () => {
    it('returns the response of the wrapped lambda', async () => {
      const handlerResponse = {
        body: '',
        statusCode: 200
      }
      const response = await errorHandler()(() => Promise.resolve(handlerResponse))({} as APIGatewayProxyEvent, {} as Context)
      expect(response).toEqual(handlerResponse)
    })
  })

  describe('with errors wit status code 400', () => {
    const statusCode = 400

    it('sets the response status code to 400', async () => {
      const response = await errorHandler()(() => { throw createHttpError(statusCode, 'Oops') })({} as APIGatewayProxyEvent, {} as Context)
      expect(response.statusCode).toEqual(400)
    })

    it('stringifies the error message', async () => {
      const response = await errorHandler()(() => { throw createHttpError(statusCode, 'Oops') })({} as APIGatewayProxyEvent, {} as Context)
      expect(JSON.parse(response.body)).toMatchObject({
        message: 'Oops'
      })
    })

    it('strips the stack', async () => {
      const response = await errorHandler()(() => { throw createHttpError(statusCode, 'Oops') })({} as APIGatewayProxyEvent, {} as Context)
      expect(JSON.parse(response.body).stack).toBeUndefined()
    })
  })

  describe('with errors wit status code 500', () => {
    const statusCode = 500

    it('sets the response status code to 500', async () => {
      const response = await errorHandler()(() => { throw createHttpError(statusCode, 'Oops') })({} as APIGatewayProxyEvent, {} as Context)
      expect(response.statusCode).toEqual(500)
    })

    it('returns only status code and the default message "Internal server error"', async () => {
      const response = await errorHandler()(() => { throw createHttpError(statusCode, 'Oops') })({} as APIGatewayProxyEvent, {} as Context)
      expect(JSON.parse(response.body)).toEqual({
        message: 'Internal server error',
        statusCode: 500
      })
    })
  })
})
