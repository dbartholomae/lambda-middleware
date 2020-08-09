import request from 'supertest'
const server = request('http://localhost:3000/dev')

describe('Handler with ieNoOpen middleware', () => {
  it('returns 200', async () => {
    await server.get('/hello').expect(200)
  })

  it('returns the X-Download-Options header set to noopen', async () => {
    const response = await server.get('/hello')
    expect(response.header['x-download-options']).toEqual('noopen')
  })
})
