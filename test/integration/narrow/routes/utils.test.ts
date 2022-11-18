import fetch from "node-fetch"

afterEach(() => {
  jest.clearAllMocks();
});

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const request = {
  method: 'GET',
  url: '/downloadall'
}

describe('fetch utility test', () => {
  test('fetch: should return data', async () => {
    const content = { mockKey: 'mockValue' };
    const mockedResponse = new Response(JSON.stringify(content));
    const mockedFetch = fetch as jest.MockedFunctionDeep<typeof fetch>
    mockedFetch.mockResolvedValueOnce(mockedResponse);
    
    const response = await global.__SERVER__.inject(request)
    expect(response.statusCode).toEqual(200);
    expect(response.result).toContain('mockKey');
    expect(response.result).toContain('mockValue');
    expect(mockedFetch).toHaveBeenCalled()
  });

  test('fetch: should throw error', async () => {
    const mockedFetchError = new Error('some error');
    (fetch as jest.MockedFunctionDeep<typeof fetch>).mockRejectedValueOnce(mockedFetchError);
    const response = await global.__SERVER__.inject(request)
    expect(response.statusCode).toEqual(500);
  });
});
