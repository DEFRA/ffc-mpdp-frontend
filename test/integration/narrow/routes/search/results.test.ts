import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions, mockGetPaymentData, filterByAmounts, filterBySchemes } from '../../../../utils/helpers'
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
})

describe('GET /results route with sortBy parameters return results page', () => {
  const searchString = 'Sons'
  let res: any
  let $: cheerio.CheerioAPI
  const sortBy='score'

  test('/results returns status 200 with sortBy parameter', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString,sortBy }))
    $ = cheerio.load(res.payload)
    expect(res.statusCode).toBe(200)
  })

  test('sortBy selection box is present on the results page', async() => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString,sortBy }))
    $ = cheerio.load(res.payload)
    const selection = $('#sortBySelection')
    expect(selection).toBeDefined()
    expect(selection.text()).toContain('Relevance')
    expect(selection.text()).toContain('Payee name')
    expect(selection.text()).toContain('Part postcode')
    expect(selection.text()).toContain('County council')
  })

  test('/results returns payment with 10 rows', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString,sortBy }))
    $ = cheerio.load(res.payload)
    const resElements = $('.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
  })

  test('The result displayed is sorted by score', async () => {
    const sortBy = 'score'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data=resElements.first().text()
    expect(data).toContain('T R Carter & Sons 1')
  })

  test('The result displayed is sorted by payee_name', async () => {
    const sortBy = 'payee_name'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data=resElements.first().text()
    expect(data).toContain('Adan Brandt Sons')
  })

  test('The result displayed is sorted by town', async () => {
    const sortBy = 'town'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data=resElements.first().text()
    expect(data).toContain('T R Carter & Sons 22')
  })

  test('The result displayed is sorted by town', async () => {
    const sortBy = 'county_council'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data=resElements.first().text()
    expect(data).toContain('T R Carter & Sons 10')
  })

  test('The result displayed is sorted by score when no sortBy passed', async () => {
    const sortBy = 'score'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data=resElements.first().text()
    expect(data).toContain('T R Carter & Sons 1')
  })

})

describe('GET /results route with schemes parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with single scheme in query params', async () => {
    const schemes = 'Sustainable Farming Incentive pilot' 
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        { 
          searchString, 
          schemes
        }
      )
    )

    const filteredData = mockData.filter(x => x.scheme === schemes)
    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
  })

  test('Get /results work with multiple schemes in query params', async () => {
    const schemes = ['Sustainable Farming Incentive pilot', 'Farming Equipment and Technology Fund']
    const options = getOptions(
      'results',
      'GET',
      { searchString },
      { schemes }
    )
    
    const res = await global.__SERVER__.inject(options)

    const dataMatchingSchemes = mockData.filter(x => schemes.includes(x.scheme))
    const $ = cheerio.load(res.payload)
    
    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(dataMatchingSchemes.find(x => x.payee_name === $(elem).text()))
    })
    
    expect($('#totalResults').text()).toMatch(`${dataMatchingSchemes.length} results`)
  })
})

describe('GET /results route with amounts parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with single amount in query params', async () => {
    const schemes = 'Sustainable Farming Incentive pilot'
    const amounts = '10000-14999'
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        { 
          searchString, 
          schemes,
          amounts
        }
      )
    )

    let filteredData = filterBySchemes(mockData, [schemes])
    filteredData = filterByAmounts(filteredData, [amounts])

    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find((x: any) => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
  })

  test('Get /results work with multiple amounts in query params', async () => {
    const schemes = ['Sustainable Farming Incentive pilot', 'Farming Equipment and Technology Fund']
    const amounts = ['10000-14999', '30000-']
    const options = getOptions(
      'results',
      'GET',
      { searchString },
      { schemes, amounts }
    )
    
    const res = await global.__SERVER__.inject(options)

    let dataMatchingSchemesAndAmounts = filterBySchemes(mockData, schemes)
    dataMatchingSchemesAndAmounts = filterByAmounts(dataMatchingSchemesAndAmounts, amounts)
    console.log(dataMatchingSchemesAndAmounts.length)
    const $ = cheerio.load(res.payload)
    
    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(dataMatchingSchemesAndAmounts.find((x: any) => x.payee_name === $(elem).text()))
    })
    
    expect($('#totalResults').text()).toMatch(`${dataMatchingSchemesAndAmounts.length} results`)
  })
})
