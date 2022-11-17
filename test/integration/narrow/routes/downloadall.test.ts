import * as utils from '../../../../app/utils'

describe('downloadall csv test', () => {
  const content = 'Sample data in csv'
  const mockedFetch = jest.spyOn(utils, 'getBuffer')
  mockedFetch.mockResolvedValue(new Buffer(content));
  const request = {
    method: 'GET',
    url: '/downloadall'
  }

  test('GET /downloadall returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadall returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'application/csv')
    expect(res.headers).toHaveProperty('content-disposition', 'attachment; filename="ffc-payment-data.csv"')
  })

  test('GET /downloadall returns the expected content', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toBe(content)
  })

})