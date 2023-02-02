import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions, mockGetPaymentData } from '../../../../utils/helpers'
import mockData from '../../../../data/mockResults'
import config from '../../../../../app/config'
import { expectTitle } from '../../../../utils/title-expect'

jest.mock('../../../../../app/backend/api', () => ({
  getPaymentData: mockGetPaymentData
}))

beforeAll(() => {
  jest.mock('../../../../../app/config', () => ({
    __esModule: true,
    default: {
      ...config,
      search: {
        limit: 10
      }
    }
  }));
})

afterAll(() => {
  jest.resetAllMocks()
})

describe('GET /results route with query parameters return results page', () => {
  const searchString = 'Sons'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }
    
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
    $ = cheerio.load(res.payload)
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Search returns status 200', () => {
    expect(res.statusCode).toBe(200)
  })

  test('Results heading contains search string', () => {
    const pageTitle = `Results for ‘${searchString}’`
    expect($('.govuk-heading-l').text()).toEqual(pageTitle)
    expectTitle($, pageTitle)
  })

  test('Search box is present on the results page', () => {
    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const searchBox = $('#resultsSearchInput')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)
  })

  test('Next button on pagination is present on the results page', () => {
    const nextBtn = $('#nextOption')
    expect(nextBtn).toBeDefined()
  })

  test('Results are displayed on the page upto the limit of 10', () => {
    const resElements = $('.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
  })

  test('Total results show the real number', () => {
    expect($('#totalResults').text()).toMatch(`${mockData.length} results`)
  })

  test('Header, footer and title gets rendered', () => {
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })
})

describe('GET /results route with pagination return new result with each page', () => {
  const searchString = 'Sons'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }

    res = await global.__SERVER__.inject(getOptions('results', 'GET', { 
      searchString,
      page: 3 
    }))
    $ = cheerio.load(res.payload)
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Search returns status 200', () => {
    expect(res.statusCode).toBe(200)
  })

  test('Results heading contains search string', () => {
    expect($('.govuk-heading-l').text()).toEqual(
      `Results for ‘${searchString}’`
    )
  })

  test('Search box is present on the results page', () => {
    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const searchBox = $('#resultsSearchInput')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)
  })

  test('Next and previous buttons on pagination is present on the results page', () => {
    const nextBtn = $('#nextOption')
    expect(nextBtn).toBeDefined()

    const prevBtn = $('#prevOption')
    expect(prevBtn).toBeDefined()
  })

  test('Page 3 only shows the 3 remaining results from dummy data', () => {
    const resElements = $('.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(3)
  })

  test('Total results show the real number', () => {
    expect($('#totalResults').text()).toMatch(`${mockData.length} results`)
  })

  test('Header, footer and title gets rendered', () => {
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })
})

describe('Seach results page shows no results message', () => {
  const searchString = '__INVALID_SEARCH_STRING__'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }

    res = await global.__SERVER__.inject(
      getOptions('results', 'GET', { 
        searchString,
        page: 3 
      })
    )
    
    $ = cheerio.load(res.payload)
  })

  test('Results heading contains no results found with searchString', () => {
    const pageTitle = `We found no results for ‘${searchString}’`
    expect($('.govuk-heading-l').text()).toEqual(pageTitle)
    expectTitle($, pageTitle)
  })

  test('Search box is present on the results page', () => {
    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const searchBox = $('#resultsSearchInput')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)
  })

  test('Total results show: 0 results', () => {
    expect($('#totalResults').text()).toMatch(`0 results`)
  })

  test('Shows no matching results message', () => {
    const noResults = $('#noResults')
    expect(noResults).toBeDefined()
    expect(noResults.text()).toMatch('There are no matching results')
  })
})

describe('Seach results page shows error message when searchString is empty', () => {
  const searchString = ''
  const pageId = 'results'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }

    res = await global.__SERVER__.inject(
      getOptions('results', 'GET', { 
        searchString,
        pageId 
      })
    )
    $ = cheerio.load(res.payload)
  })

  test('Results heading show empty string', () => {
    expect($('.govuk-heading-l').text()).toEqual(
      `Results for ‘${searchString}’`
    )
  })

  test('Error heading is displayed', () => {
    expect($('.govuk-error-summary__title').text()).toContain('There is a problem')
  })

  test('Search box is present and shows error', () => {
    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const searchInputError = $('#search-input-error')
    expect(searchInputError).toBeDefined()
    expect(searchInputError.text()).toContain('Error: Enter a search term')

    const searchErrorBox = $('.govuk-input.govuk-input--error')
    expect(searchErrorBox).toBeDefined()
    expect(searchErrorBox.val()).toMatch(searchString)
  })

  test('Total results show: 0 results', () => {
    expect($('#totalResults').text()).toMatch(`0 results`)
  })

  test('Shows no matching results message', () => {
    const noResults = $('#noResults')
    expect(noResults).toBeDefined()
    expect(noResults.text()).toMatch('There are no matching results')
  })

  test('Page title contains error text', () => {
    expect($('title').text()).toContain('Error')
  })
})
