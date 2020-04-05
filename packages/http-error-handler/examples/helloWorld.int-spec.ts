import request from 'supertest'
const server = request('http://localhost:3000/dev')

describe('Handler with error handler middleware', () => {
  describe('with a search query method', () => {
    const query = '/hello?search=x'
    it('returns 500 and JSON with an Internal server error message', async () => {
      const response = await server.get(query).expect(500)
      expect(response.body.message).toEqual('Internal server error')
    })
  })

  describe('without a search query method', () => {
    const query = '/hello'
    it('returns 400 and JSON with a "Query has to include a search" error message', async () => {
      const response = await server.get(query).expect(400)
      expect(response.body.message).toEqual('Query has to include a search')
    })
  })
})
