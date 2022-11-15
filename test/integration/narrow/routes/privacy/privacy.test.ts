import { getOptions } from '../../../../utils/helpers'

describe('MPDP Privacy page test', () => {
  test('GET /privacy route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('privacy'))
    expect(res.statusCode).toBe(200)
  })
})
  