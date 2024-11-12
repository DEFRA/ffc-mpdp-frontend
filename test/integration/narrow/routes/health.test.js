const { getOptions } = require('../../../utils/helpers')

describe('Health test', () => {
  test('GET /healthy route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('healthy'))
    expect(res.statusCode).toBe(200)
  })

  test('GET /healthz route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('healthz'))
    expect(res.statusCode).toBe(200)
  })
})
