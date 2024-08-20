const api = require('../../../../app/backend/api')

afterEach(() => {
  jest.clearAllMocks()
})

describe('downloaddetails csv test', () => {
  const content = 'Sample data in csv'
  const mockedFetch = jest.spyOn(api, 'getDownloadDetailsCsv')
  mockedFetch.mockResolvedValue(content)
  const request = {
    method: 'GET',
    url: '/downloaddetails?payeeName=Mathew Johnston&partPostcode=WA14'
  }

  test('GET /downloaddetails returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloaddetails returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'application/csv')
    expect(res.headers).toHaveProperty('content-disposition', 'attachment; filename="ffc-payment-details.csv"')
  })

  test('GET /downloaddetails returns the expected content', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toBe(content)
  })
})

describe('downloaddetails csv error test', () => {
  const request = {
    method: 'GET',
    url: '/downloaddetails?payeeName=Mathew Johnston&partPostcode=WA14'
  }

  test('GET /downloaddetails throws error when underlying error', async () => {
    const mockedFetch = jest.spyOn(api, 'getDownloadDetailsCsv')
    mockedFetch.mockRejectedValue(Error('Internal Server Error'))
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })
})
