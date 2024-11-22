const api = require('../../../../app/backend/api')

describe('/downloadAllData csv test', () => {
  const request = {
    method: 'GET',
    url: '/downloadalldata'
  }

  jest.spyOn(api, 'getDownloadAllCsv')
    .mockReturnValue('Content')

  test('GET /downloadAllData returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadAllData returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'text/csv; charset=utf-8')
    expect(res.headers).toHaveProperty('content-disposition', 'attachment; filename="ffc-payment-data.csv"')
  })
})

describe('/downloadAllData csv error test', () => {
  const request = {
    method: 'GET',
    url: '/downloadalldata'
  }

  test('GET /downloadAllData throws error when underlying error', async () => {
    jest.spyOn(api, 'getDownloadAllCsv')
      .mockImplementation(() => { throw new Error() })

    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })
})
