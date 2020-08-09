import {
  ClassValidatorMiddlewareOptions,
  isMiddlewareOptions
} from './ClassValidatorMiddlewareOptions'

class Validator {}

describe('ClassValidatorMiddlewareOptions', () => {
  describe('interface', () => {
    it('accepts valid options', () => {
      const options: ClassValidatorMiddlewareOptions<Validator> = {
        classType: Validator
      }
      expect(options).toBeDefined()
    })
  })

  describe('type guard', () => {
    it('accepts valid options', () => {
      const options = {
        classType: Validator
      }
      expect(isMiddlewareOptions(options)).toBe(true)
    })

    it('rejects invalid options', () => {
      const options = {}
      expect(isMiddlewareOptions(options)).toBe(false)
    })
  })
})
