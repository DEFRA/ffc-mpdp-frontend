const api = require('../../../../app/backend/api')

afterEach(() => {
  jest.clearAllMocks()
})

describe('downloadresults csv test', () => {
  const content = {
    res: {},
    payload: 'Sample data in csv'
  }
  const mockedFetch = jest.spyOn(api, 'post')
  mockedFetch.mockResolvedValue(content)
  const request = {
    method: 'GET',
    url: '/downloadresults?searchString=john&sortBy=score'
  }

  test('GET /downloadresults returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadresults returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'application/csv')
    expect(res.headers).toHaveProperty('content-disposition', 'attachment; filename="ffc-payment-results.csv"')
  })

  test('GET /downloadresults returns the expected content', async () => {
    const mockedFetch = jest.spyOn(api, 'get')
    mockedFetch.mockResolvedValue({
      res: {},
      payload: 'Sample data in csv'
    })

    const res = await global.__SERVER__.inject(request)
    expect(res.result).toBe(content.payload)
  })
})

describe('downloadresults csv error test', () => {
  const request = {
    method: 'GET',
    url: '/downloadresults?searchString=john&sortBy=score'
  }

  test('GET /downloadresults throws error when underlying error', async () => {
    const mockedFetch = jest.spyOn(api, 'post')
    mockedFetch.mockRejectedValue(Error('Internal Server Error'))
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })
})
