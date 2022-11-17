import { getOptions } from '../../../utils/helpers'
describe('downloadall csv test', () => {
  test('GET /downloadall route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('downloadall'))
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadall route returns attachment', async () => {
    const res = await global.__SERVER__.inject(getOptions('downloadall'))
    expect(res.headers.mode).toContain('attachment')
  })
})
