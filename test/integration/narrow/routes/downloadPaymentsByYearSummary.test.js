const api = require('../../../../app/backend/api')

afterEach(() => {
  jest.clearAllMocks()
})

describe('downloadPaymentsByYearSummary csv test', () => {
  const content = {
    res: {},
    payload: 'Sample data in csv'
  }
  const mockedFetch = jest.spyOn(api, 'get')
  mockedFetch.mockResolvedValue(content)

  const request = {
    method: 'GET',
    url: '/downloadPaymentsByYearSummary'
  }

  test('GET /downloadPaymentsByYearSummary returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadPaymentsByYearSummary returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'application/csv')
    expect(res.headers).toHaveProperty(
      'content-disposition',
      'attachment; filename="ffc-payments-by-year.csv"'
    )
  })

  test('GET /downloadPaymentsByYearSummary returns the expected content', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toBe(content.payload)
  })

  test('GET /downloadPaymentsByYearSummary throws error when underlying error', async () => {
    mockedFetch.mockRejectedValue('Internal Server Error')
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })
})
