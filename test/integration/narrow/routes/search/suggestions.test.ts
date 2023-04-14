import { getOptions } from '../../../../utils/helpers';
import { mockSuggestions } from '../../../../data/mockSuggestions';

jest.mock('../../../../../app/backend/api', () => ({
	getSearchSuggestions: () => mockSuggestions,
}));

describe('GET /suggestions route', () => {
	afterEach(() => {
    jest.resetAllMocks()
  })

  test('GET /suggestions returns status 200', async () => {
		const res = await global.__SERVER__.inject(getOptions('suggestions', 'GET', { searchString: 'Test String' }))
    expect(res.statusCode).toBe(200)
  })

	test('GET /suggestions returns 400 error when searchString is not in the query params', async () => {
		const res = await global.__SERVER__.inject(getOptions('suggestions'))
    expect(res.statusCode).toBe(400)
  })

	test('GET /suggestions returns 400 error when searchString contains any special characters other than single quote and hyphens', async () => {
    const res = await global.__SERVER__.inject(getOptions('suggestions', 'GET', { searchString: '%!__TEST_STRING__' }))
		expect(res.statusCode).toBe(400)
  })

	test('GET /suggestions returns status 200 when searchString contains a single quote or hyphen', async () => {
    const res = await global.__SERVER__.inject(getOptions('suggestions', 'GET', { searchString: "Test String ' -" }))
		expect(res.statusCode).toBe(200)
  })

	test('GET /suggestions returns mocked data', async () => {
		const res = await global.__SERVER__.inject(getOptions('suggestions', 'GET', { searchString: 'Test String' }))
    expect(res.payload).toEqual(JSON.stringify(mockSuggestions))
  })
});
