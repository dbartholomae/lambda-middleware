import { classValidator } from './classValidator'

import { IsString } from 'class-validator'

class NameBody {
  @IsString()
  public firstName: string

  @IsString()
  public lastName: string
}

describe('classValidator', () => {
  describe('with valid input', () => {
    const body = JSON.stringify({
      firstName: 'John',
      lastName: 'Doe'
    })

    it('sets the body to the transformed and validated value', async () => {
      const handler = jest.fn()
      await classValidator({
        classType: NameBody
      })(handler)({ body }, {} as any)
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            firstName: 'John',
            lastName: 'Doe'
          }
        }),
        expect.anything()
      )
    })
  })

  describe('with invalid input', () => {
    const body = JSON.stringify({
      firstName: 'John'
    })

    it('throws an error with statusCode 400', async () => {
      const handler = jest.fn()
      await expect(
        classValidator({
          classType: NameBody
        })(handler)({ body }, {} as any)
      ).rejects.toMatchObject({
        statusCode: 400
      })
    })
  })
})
