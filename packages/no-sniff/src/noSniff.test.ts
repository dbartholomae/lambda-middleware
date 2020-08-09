import { noSniff } from './noSniff'

describe('noSniff', () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: ''
    }
    const handler = jest.fn().mockResolvedValue(response)
    expect(await noSniff()(handler)({} as any, {} as any)).toMatchObject(
      response
    )
  })

  it('sets the X-Content-Type-Options header to nosniff', async () => {
    const response = {
      statusCode: 200,
      body: ''
    }
    const handler = jest.fn().mockResolvedValue(response)
    expect(await noSniff()(handler)({} as any, {} as any)).toMatchObject({
      headers: {
        'X-Content-Type-Options': 'nosniff'
      }
    })
  })
})
