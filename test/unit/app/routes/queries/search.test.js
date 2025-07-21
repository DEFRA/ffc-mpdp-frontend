const { resultsQuery } = require('../../../../../app/routes/queries/search/results')
jest.mock('../../../../../app/routes/models/search/results')
const resultsRoute = require('../../../../../app/routes/search/results')
const { resultsModel } = require('../../../../../app/routes/models/search/results')

describe('search results schema', () => {
  test('throws error if searchString is missing', () => {
    const { error } = resultsQuery.validate({})
    expect(error).not.toBeNull()
  })

  test('throws error if searchString is empty', () => {
    const { error } = resultsQuery.validate({ searchString: '' })
    expect(error).not.toBeNull()
  })

  test('does not throw error if searchString is present', () => {
    const { error } = resultsQuery.validate({ searchString: 'test' })
    expect(error).toBeUndefined()
  })

  test('defaults page to 1 if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.page).toBe(1)
  })

  test('throws error if page is not a number', () => {
    const { error } = resultsQuery.validate({ searchString: 'test', page: 'test' })
    expect(error).not.toBeNull()
  })

  test('defaults pageId to empty string if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.pageId).toBe('')
  })

  test('defaults schemes to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.schemes).toEqual([])
  })

  test('defaults amounts to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.amounts).toEqual([])
  })

  test('defaults years to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.years).toEqual([])
  })

  test('defaults counties to empty array if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.counties).toEqual([])
  })

  test('defaults sortBy to score if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.sortBy).toBe('score')
  })

  test('defaults referer to empty string if not present', () => {
    const { value } = resultsQuery.validate({ searchString: 'test' })
    expect(value.referer).toBe('')
  })

  test('does not throw error if referer is empty', () => {
    const { error } = resultsQuery.validate({ searchString: 'test', referer: '' })
    expect(error).toBeUndefined()
  })
})

describe('graceful redirect of /results route to /search', () => {
  let route

  beforeAll(() => {
    route = resultsRoute.find(route => route.path === '/results')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('failAction', () => {
    test('renders search/1 view when searchString is empty or whitespace', async () => {
      const request = {
        query: { searchString: '   ', pageId: '1' },
        headers: { referer: '/search' }
      }
      const mockView = jest.fn().mockReturnValue({
        code: jest.fn().mockReturnValue({ takeover: () => 'result' })
      })
      const h = { view: mockView }

      await route.options.validate.failAction(request, h, new Error('validation error'))

      expect(mockView).toHaveBeenCalledWith('search/1', undefined)
    })

    test('renders search/index view with error details for validation failures', async () => {
      const request = { query: { searchString: 'test' } }
      const mockView = jest.fn().mockReturnValue({
        code: jest.fn().mockReturnValue({ takeover: () => 'result' })
      })
      const h = { view: mockView }
      const error = { details: [{ message: 'Invalid input' }] }

      await route.options.validate.failAction(request, h, error)

      expect(mockView).toHaveBeenCalledWith('search/index',
        expect.objectContaining({
          errorList: [{ text: 'Invalid input' }]
        })
      )
    })
  })

  describe('handler', () => {
    test('calls resultsModel and renders search/results view', async () => {
      const request = {
        query: {
          searchString: 'test',
          page: 1,
          schemes: [],
          amounts: [],
          years: [],
          counties: []
        },
        headers: { referer: '/search' }
      }
      const mockView = jest.fn()
      const h = { view: mockView }
      const mockResults = { data: 'mock data' }

      resultsModel.mockResolvedValue(mockResults)

      await route.options.handler(request, h)

      expect(resultsModel).toHaveBeenCalledWith(request)
      expect(mockView).toHaveBeenCalledWith('search/results', mockResults)
    })
  })
})
