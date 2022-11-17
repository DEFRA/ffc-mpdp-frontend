import * as utils from '../../../../app/utils'

afterEach(() => {
  jest.clearAllMocks();
});


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


describe('downloadall csv error test', () => {
  const request = {
    method: 'GET',
    url: '/downloadall'
  }

  test('GET /downloadall throws error when underlying error', async () => {
    const mockedFetch = jest.spyOn(utils, 'getBuffer')
    mockedFetch.mockRejectedValue('Internal Server Error')
    const res = await global.__SERVER__.inject(request)
    console.log(res)
    expect(res.statusCode).toBe(500)
  })

  test('GET /downloadall throws error when no response', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })

})