import { getOptions } from '../../../utils/helpers'
describe('Healthz test', () => {
  test('GET /healthz route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('healthz'))

    expect(res.statusCode).toBe(200)
  })
})
