import { omit } from './omit'

describe('omit', () => {
  it('returns an object without the omitted properties', () => {
    expect(
      (omit(['a'], {
        a: 'test'
      }) as any).a
    ).toBeUndefined()
  })

  it('returns an object with the not-omitted properties', () => {
    expect(
      (omit(['a'], {
        b: 'b'
      }) as any).b
    ).toEqual('b')
  })

  it('returns a new object', () => {
    const originalObject = {
      a: 'a',
      b: 'b'
    }
    const newObject = omit(['a'], originalObject)
    originalObject.b = 'new'
    expect(newObject.b).toEqual('b')
  })
})
