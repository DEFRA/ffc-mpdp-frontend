const endpoint = 'https://__TEST_ENDPOINT__'
process.env.MPDP_BACKEND_ENDPOINT = endpoint

const path = process.env.MPDP_BACKEND_PATH

const wreck = require('@hapi/wreck')
const { get, getPaymentData, getPaymentDetails, getSearchSuggestions, getDownloadDetailsCsv, post, getUrlParams } = require('../../../../app/backend/api')
const mockSuggestions = require('../../../data/mockSuggestions')

const fetchMock = jest.spyOn(global, 'fetch')

describe('Backend API tests', () => {
  const route = '/__TEST_ROUTE__'
  const mockData = [{
    payee_name: 'T R Carter & Sons 1',
    part_postcode: 'RG1',
    town: 'Reading',
    county_council: 'Berkshire',
    amount: '11142000.95'
  }]

  test('service uses the env variable to connect to the backend service', async () => {
    const mockGet = jest.fn()
    const mockPost = jest.fn()
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)
    jest.spyOn(wreck, 'post').mockImplementation(mockPost)

    await get(route)
    await post(route, {})

    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${route}`)
    expect(mockPost).toHaveBeenCalledWith(`${endpoint}${path}${route}`, { payload: {} })
  })

  test('get function handles error and shows a console error log', async () => {
    const mockConsoleErr = jest.fn()
    console.error = mockConsoleErr

    const mockGet = jest.fn().mockRejectedValue(null)
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)

    await get(route)

    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${route}`)
    expect(mockConsoleErr).toHaveBeenCalled()
  })

  test('post function handles error and shows a console error log', async () => {
    const mockConsoleErr = jest.fn()
    console.error = mockConsoleErr

    const mockPost = jest.fn().mockRejectedValue(null)
    jest.spyOn(wreck, 'post').mockImplementation(mockPost)

    await post(route, {})

    expect(mockPost).toHaveBeenCalledWith(`${endpoint}${path}${route}`, { payload: {} })
    expect(mockConsoleErr).toHaveBeenCalled()
  })

  test('getPaymentData return empty results list if no response is received', async () => {
    const mockPost = jest.fn().mockResolvedValue(null)
    jest.spyOn(wreck, 'post').mockImplementation(mockPost)

    const searchString = '__TEST_STRING__'
    const offset = 0
    const sortBy = 'score'
    const filterBy = { schemes: [] }
    const res = await getPaymentData(searchString, offset, filterBy, sortBy)
    expect(res).toMatchObject({
      results: [],
      total: 0,
      filterOptions: {}
    })

    expect(mockPost).toHaveBeenCalledWith(`${endpoint}${path}`, { payload: { filterBy, limit: 20, offset, searchString, sortBy } })
  })

  test('getPaymentData returns results from the payload in the right format', async () => {
    const mockPost = jest.fn().mockResolvedValue({
      payload: JSON.stringify({
        rows: mockData,
        count: 1,
        filterOptions: {}
      })
    })
    jest.spyOn(wreck, 'post').mockImplementation(mockPost)

    const searchString = '__TEST_STRING__'
    const offset = 0
    const filterBy = { schemes: [] }
    const sortBy = 'score'
    const res = await getPaymentData(searchString, offset, filterBy, sortBy)
    expect(res).toMatchObject({
      results: mockData,
      total: mockData.length,
      filterOptions: {}
    })

    expect(mockPost).toHaveBeenCalledWith(`${endpoint}${path}`, { payload: { filterBy, limit: 20, offset, searchString, sortBy } })
  })

  test('getPaymentData called with download action', async () => {
    const mockPost = jest.fn().mockResolvedValue({
      payload: JSON.stringify({
        rows: mockData,
        count: 1
      })
    })
    jest.spyOn(wreck, 'post').mockImplementation(mockPost)

    const searchString = '__TEST_STRING__'
    const offset = 0
    const filterBy = { schemes: [] }
    const sortBy = 'score'
    const action = 'download'
    const res = await getPaymentData(searchString, offset, filterBy, sortBy, action)
    expect(res).toMatchObject({
      results: mockData,
      total: mockData.length
    })

    expect(mockPost).toHaveBeenCalledWith(`${endpoint}${path}`, { payload: { filterBy, limit: 20, offset, searchString, sortBy, action } })
  })

  test('getPaymentDetails returns null if no response is received', async () => {
    const mockGet = jest.fn().mockResolvedValue(null)
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)

    const payeeName = '__PAYEE_NAME__'
    const partPostcode = '__POST_CODE'
    const res = await getPaymentDetails(payeeName, partPostcode)
    expect(res).toBe(null)

    const route = getUrlParams(`${payeeName}/${partPostcode}`)

    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${route}`)
  })

  test('getPaymentDetails returns results', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      payload: JSON.stringify(mockData)
    })
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)

    const payeeName = '__PAYEE_NAME__'
    const partPostcode = '__POST_CODE'
    const res = await getPaymentDetails(payeeName, partPostcode)
    expect(res).toMatchObject(mockData)

    const newRoute = getUrlParams(`${payeeName}/${partPostcode}`)
    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${newRoute}`)
  })

  test('getSearchSuggestions returns default object if no response is received', async () => {
    const mockGet = jest.fn().mockResolvedValue(null)
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)

    const searchString = '__PAYEE_NAME__'
    const res = await getSearchSuggestions(searchString)
    expect(res).toEqual({ rows: [], count: 0 })

    const newRoute = getUrlParams('search', { searchString })
    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${newRoute}`)
  })

  test('getSearchSuggestions returns results', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      payload: JSON.stringify(mockSuggestions)
    })
    jest.spyOn(wreck, 'get').mockImplementation(mockGet)

    const searchString = '__TEST_STRING__'
    const res = await getSearchSuggestions(searchString)
    expect(res).toMatchObject(mockSuggestions)

    const newRoute = getUrlParams('search', { searchString })
    expect(mockGet).toHaveBeenCalledWith(`${endpoint}${path}${newRoute}`)
  })
  test('getDownloadDetailsCsv returns results', async () => {
    const content = 'TEST_CSV_CONTENT'
    const bufferedData = Buffer.from(content)
    const mockedResponse = new Response(bufferedData, {})
    fetchMock.mockResolvedValueOnce(mockedResponse)

    const payeeName = '__PAYEE_NAME__'
    const partPostcode = '__POST_CODE'
    const newRoute = getUrlParams(`${payeeName}/${partPostcode}`)
    const res = await getDownloadDetailsCsv(payeeName, partPostcode)

    // Verify the result
    expect(fetchMock).toHaveBeenCalledWith(`${endpoint}${path}${newRoute}/file`)
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(res).toBeInstanceOf(Buffer)
    expect(res).toEqual(bufferedData)
  })

  test('getDownloadDetailsCsv returns error', async () => {
    const mockedFetchError = new Error('Error while reading from URL ')
    fetchMock.mockRejectedValueOnce(mockedFetchError)

    await expect(getDownloadDetailsCsv('__PAYEE_NAME__', '__POST_CODE')).rejects.toThrowError(Error)
  })

  test('getUrlParams returns correct value', () => {
    const page = '__TEST_ROUTE__'
    const obj = {
      val: '__VALUE__',
      anotherVal: '__ANOTHER_VALUE__'
    }

    const url = getUrlParams(page, obj)
    expect(url).toMatch(`/${page}?val=${obj.val}&anotherVal=${obj.anotherVal}`)
  })
})
