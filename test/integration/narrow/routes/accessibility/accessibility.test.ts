import { getOptions } from '../../../../utils/helpers'

describe('MPDP Accessibility page test', () => {
  test('GET /accessibility route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('accessibility'))
    expect(res.statusCode).toBe(200)
  })
})
