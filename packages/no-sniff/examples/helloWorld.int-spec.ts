import request from 'supertest'
const server = request('http://localhost:3000/dev')

describe('Handler with json serializer middleware', () => {
  it('returns 200', async () => {
    await server.get('/hello').expect(200)
  })

  it('returns the stringified JSON response', async () => {
    const response = await server.get('/hello')
    expect(response.body).toEqual({})
  })
})
