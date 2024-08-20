const { getOptions } = require('../../../utils/helpers')

describe('Healthy test', () => {
  test('GET /healthy route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('healthy'))

    expect(res.statusCode).toBe(200)
  })
})
