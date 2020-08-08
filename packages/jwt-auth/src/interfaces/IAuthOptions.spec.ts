import {
  EncryptionAlgorithms,
  IAuthOptions,
  isAuthOptions
} from './IAuthOptions'

describe('IAuthOptions', () => {
  describe('interface', () => {
    it('accepts data that has algorithm and a string secretOrPublicKey', () => {
      const options: IAuthOptions = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: 'secret'
      }
      expect(options).not.toBeNull()
    })

    it('accepts data that has algorithm and a Buffer secretOrPublicKey', () => {
      const options: IAuthOptions = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: Buffer.from([])
      }
      expect(options).not.toBeNull()
    })

    it('accepts data that has algorithm, a string secretOrPublicKey and a payload type guard', () => {
      interface IPayload {
        foo: string
      }
      function isPayload (payload: any): payload is IPayload {
        return payload != null && typeof payload.foo === 'string'
      }
      const options: IAuthOptions<IPayload> = {
        algorithm: EncryptionAlgorithms.ES256,
        isPayload,
        secretOrPublicKey: 'secret'
      }
      expect(options).not.toBeNull()
    })

    it('accepts data that has algorithm, a string secretOrPublicKey and a tokenSource', () => {
      function tokenSource (event: any): string {
        return ''
      }
      const options: IAuthOptions = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: 'secret',
        tokenSource
      }
      expect(options).not.toBeNull()
    })
  })

  describe('type guard', () => {
    it('accepts data that has algorithm and a string secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: 'secret'
        })
      ).toBe(true)
    })

    it('accepts data that has algorithm and a Buffer secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: Buffer.from([])
        })
      ).toBe(true)
    })

    it('accepts data that has algorithm, a string secretOrPublicKey and a payload type guard', () => {
      interface IPayload {
        foo: string
      }
      function isPayload (payload: any): payload is IPayload {
        return payload != null && typeof payload.foo === 'string'
      }
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          isPayload,
          secretOrPublicKey: 'secret'
        })
      ).toBe(true)
    })

    it('accepts data that has algorithm, a string secretOrPublicKey and an array of tokenSources', () => {
      function tokenSource (event: any): string {
        return ''
      }
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: 'secret',
          tokenSources: [tokenSource]
        })
      ).toBe(true)
    })

    it('accepts data that has algorithm, a string secretOrPublicKey and a boolean credentialsRequired', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          credentialsRequired: true,
          secretOrPublicKey: 'secret'
        })
      ).toBe(true)
    })

    it('rejects data that is null', () => {
      expect(isAuthOptions(null)).toBe(false)
    })

    it('rejects data without algorithm', () => {
      expect(
        isAuthOptions({
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })

    it("rejects data with algorithm that isn't an EncryptionAlgorithm ", () => {
      expect(
        isAuthOptions({
          algorithm: 'some string',
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })

    it('rejects data without secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256
        })
      ).toBe(false)
    })

    it("rejects data where secretOrPublicKey isn't a string or Buffer", () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: {}
        })
      ).toBe(false)
    })

    it('rejects data with a payload type guard that is not a function', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          isPayload: {} as any,
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })

    it('rejects data with malformed tokenSource', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: 'secret',
          tokenSource: {}
        })
      ).toBe(false)
    })

    it('rejects data with an credentialsRequired that is not a boolean', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          credentialsRequired: '',
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })
  })
})
