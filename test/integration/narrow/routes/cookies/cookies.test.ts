import { getOptions } from '../../../../utils/helpers'

describe('MPDP Cookies page test', () => {
  test('GET /cookies route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('cookies'))
    expect(res.statusCode).toBe(200)
  })
})
  