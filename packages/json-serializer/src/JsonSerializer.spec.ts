import { jsonSerializer } from './JsonSerializer'

describe('jsonSerializer', () => {
  describe('with a handler returning an empty object', () => {
    let response: any

    beforeEach(async () => {
      const handler = () => ({})
      const handlerWithMiddleware = jsonSerializer()(handler)
      response = await handlerWithMiddleware({}, {})
    })

    it('returns 200', async () => {
      expect(response).toMatchObject({statusCode: 200})
    })

    it('returns the stringified JSON response', async () => {
      expect(response.body).toEqual("{}")
    })
  })

  describe('with a handler returning an object with a circular reference', () => {
    let handlerWithMiddleware: any

    beforeEach(async () => {
      const returnedObject: any = {}
      returnedObject.foo = returnedObject
      const handler = () => returnedObject
      handlerWithMiddleware = jsonSerializer()(handler)
    })

    it('rejects', async () => {
      await expect(handlerWithMiddleware({}, {})).rejects.toBeDefined()
    })
  })
})
