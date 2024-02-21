import * as Http from 'http';
import * as api from '../../../../app/backend/api'

afterEach(() => {
  jest.clearAllMocks();
});

describe('downloadall csv test', () => {
  const content = {
    res: {} as unknown as Http.IncomingMessage,
    payload: 'Sample data in csv'
  }
  const mockedFetch = jest.spyOn(api, 'get')
  mockedFetch.mockResolvedValue(content);
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
    const mockedFetch = jest.spyOn(api, 'get')
    mockedFetch.mockResolvedValue({
      res: {} as unknown as Http.IncomingMessage,
      payload: 'Sample data in csv'
    });

    const res = await global.__SERVER__.inject(request)
    expect(res.result).toBe(content.payload)
  })
})


describe('downloadall csv error test', () => {
  const request = {
    method: 'GET',
    url: '/downloadall'
  }

  test('GET /downloadall throws error when underlying error', async () => {
    const mockedFetch = jest.spyOn(api, 'get')
    mockedFetch.mockRejectedValue('Internal Server Error')
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })
})