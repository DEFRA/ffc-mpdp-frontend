import { getOptions } from '../../../utils/helpers'

describe('Download all test', () => {
  test('GET /downloadall route returns 301', async () => {
    const res = await global.__SERVER__.inject(getOptions('downloadall'))
    expect(res.statusCode).toBe(301)
  })
})
