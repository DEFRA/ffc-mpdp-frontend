const cheerio = require('cheerio')
const { expectFooter } = require('../../../../utils/footer-expects')
const { expectHeader } = require('../../../../utils/header-expects')
const { expectPhaseBanner } = require('../../../../utils/phase-banner-expect')
const { getOptions, mockGetPaymentData, filterBySchemes, filterByCounties, getFilterOptions, filterByYears } = require('../../../../utils/helpers')
const mockData = require('../../../../data/mockResults')
const config = require('../../../../../app/config')
const { expectTitle } = require('../../../../utils/title-expect')
const { expectTags } = require('../../../../utils/tags-expects')
const counties = require('../../../../../app/data/filters/counties')
const { schemeStaticData } = require('../../../../../app/data/schemeStaticData')

jest.mock('../../../../../app/backend/api', () => ({
  getPaymentData: mockGetPaymentData
}))

beforeAll(() => {
  jest.mock('../../../../../app/config', () => ({
    ...config,
    search: {
      limit: 10
    }
  }))
})

afterAll(() => {
  jest.resetAllMocks()
})

describe('GET /results route with query parameters return results page', () => {
  const searchString = 'Sons'
  let res
  let $
  beforeEach(async () => {
    if (res) { return }

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
  let res
  let $

  beforeEach(async () => {
    if (res) { return }

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

describe('Seach results page test with no results', () => {
  const searchString = '__INVALID_SEARCH_STRING__'
  let res
  let $

  beforeEach(async () => {
    if (res) { return }

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
    expect($('#totalResults').text()).toMatch('0 results')
  })

  test('Shows no matching results message', () => {
    const noResults = $('#noResults')
    expect(noResults).toBeDefined()
    expect(noResults.text()).toMatch('There are no matching results')
  })

  test('All filters are displayed', () => {
    expect($('#schemesFilter .govuk-checkboxes__item').length).toBe(schemeStaticData.length)
    expect($('#countiesFilter .govuk-checkboxes__item').length).toBe(counties.length)
  })

  test('SortBy dropdown is not shown to the user', () => {
    expect($('#sortBySelection').length).toBe(0)
  })
})

describe('Seach results page shows error message when searchString is empty', () => {
  const searchString = ''
  const pageId = 'results'
  let res
  let $

  beforeEach(async () => {
    if (res) { return }

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
    expect(searchInputError.text()).toContain('Error: Enter a name or location')

    const searchErrorBox = $('.govuk-input.govuk-input--error')
    expect(searchErrorBox).toBeDefined()
    expect(searchErrorBox.val()).toMatch(searchString)
  })

  test('Total results show: 0 results', () => {
    expect($('#totalResults').text()).toMatch('0 results')
  })

  test('Shows no matching results message', () => {
    const noResults = $('#noResults')
    expect(noResults).toBeDefined()
    expect(noResults.text()).toMatch('There are no matching results')
  })

  test('Page title contains error text', () => {
    expect($('title').text()).toContain('Error')
  })

  test('SortBy dropdown is not shown to the user', () => {
    expect($('#sortBySelection').length).toBe(0)
  })
})

describe('GET /results route with sortBy parameters return results page', () => {
  const searchString = 'Sons'
  let res
  let $
  const sortBy = 'score'

  test('/results returns status 200 with sortBy parameter', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)
    expect(res.statusCode).toBe(200)
  })

  test('sortBy selection box is present on the results page', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)
    const selection = $('#sortBySelection')
    expect(selection).toBeDefined()
    expect(selection.text()).toContain('Relevance')
    expect(selection.text()).toContain('Payee name')
    expect(selection.text()).toContain('Part postcode')
    expect(selection.text()).toContain('County council')
  })

  test('/results returns payment with 10 rows', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
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
    const data = resElements.first().text()
    expect(data).toContain('T R Carter & Sons 1')
  })

  test('The result displayed is sorted by payee_name', async () => {
    const sortBy = 'payee_name'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data = resElements.first().text()
    expect(data).toContain('Adan Brandt Sons')
  })

  test('The result displayed is sorted by town', async () => {
    const sortBy = 'town'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data = resElements.first().text()
    expect(data).toContain('T R Carter & Sons 22')
  })

  test('The result displayed is sorted by town', async () => {
    const sortBy = 'county_council'
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString, sortBy }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data = resElements.first().text()
    expect(data).toContain('T R Carter & Sons 10')
  })

  test('The result displayed is sorted by score when no sortBy passed', async () => {
    res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
    $ = cheerio.load(res.payload)

    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(10)
    const data = resElements.first().text()
    expect(data).toContain('T R Carter & Sons 1')
  })
})

describe('GET /results route with schemes parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with single scheme in query params', async () => {
    const schemes = 'Sustainable Farming Incentive'
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
    const schemes = ['Sustainable Farming Incentive', 'Farming Resilience Fund']
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
    expectTags($, schemes)
  })
})

describe('GET /results route with amounts parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with no amount in query params', async () => {
    const schemes = 'Sustainable Farming Incentive'
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

    const filteredData = filterBySchemes(mockData, [schemes])
    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
    expectTags($, [schemes])
  })
})

describe('GET /results route with years parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with single year in query params', async () => {
    const schemes = 'Farming Resilience Fund'
    const years = '21/22'
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        {
          searchString,
          schemes,
          years
        }
      )
    )

    let filteredData = filterBySchemes(mockData, [schemes])
    filteredData = filterByYears(filteredData, [years])

    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
    expectTags($, [schemes, `20${years.slice(0, 2)} to 20${years.slice(3, 5)}`])
  })

  test('Get /result works with multiple year in query params', async () => {
    const schemes = ['Sustainable Farming Incentive', 'Farming Resilience Fund']
    const years = ['21/22', '22/23']
    const options = getOptions(
      'results',
      'GET',
      { searchString },
      { schemes, years }
    )

    const res = await global.__SERVER__.inject(options)

    let filteredData = filterBySchemes(mockData, schemes)
    filteredData = filterByYears(filteredData, years)

    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
  })
})

describe('GET /results route with counties parameter works', () => {
  const searchString = 'Sons'

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('Get /result works with single county in query params', async () => {
    const schemes = 'Farming Resilience Fund'
    const counties = 'Durham, East'
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        {
          searchString,
          schemes,
          counties
        }
      )
    )

    let filteredData = filterBySchemes(mockData, [schemes])
    filteredData = filterByCounties(filteredData, [counties])

    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(filteredData.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${filteredData.length} results`)
    expectTags($, [schemes, counties])
  })

  test('Get /results work with multiple counties in query params', async () => {
    const schemes = ['Sustainable Farming Incentive', 'Farming Resilience Fund']
    const counties = ['Durham, East', 'Berkshire']
    const options = getOptions(
      'results',
      'GET',
      { searchString },
      { schemes, counties }
    )

    const res = await global.__SERVER__.inject(options)

    let dataMatchingSchemesAndCounties = filterBySchemes(mockData, schemes)
    dataMatchingSchemesAndCounties = filterByCounties(dataMatchingSchemesAndCounties, counties)

    const $ = cheerio.load(res.payload)

    $('a.govuk-link.govuk-link--no-visited-state').each((_i, elem) => {
      expect(dataMatchingSchemesAndCounties.find(x => x.payee_name === $(elem).text()))
    })

    expect($('#totalResults').text()).toMatch(`${dataMatchingSchemesAndCounties.length} results`)
  })

  describe('Test download results csv link in results page', () => {
    test('download csv link is present on the results page', async () => {
      const res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
      const $ = cheerio.load(res.payload)
      const downloadLink = $('#downloadResultsLink')
      expect(downloadLink).toBeDefined()

      const resElements = $('a.govuk-link.govuk-link--no-visited-state')
      expect(resElements.length).toBeGreaterThan(0)
      const data = resElements.first().text()
      expect(data).toContain('T R Carter & Sons 1')
    })

    test('GET /results download csv link contains the right values', async () => {
      const searchString = 'Sons'
      const res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
      const $ = cheerio.load(res.payload)

      const downloadLink = $('#downloadResultsLink')
      expect(downloadLink).toBeDefined()
      const resElements = $('a.govuk-link.govuk-link--no-visited-state')
      expect(resElements.length).toBeGreaterThan(0)
      const data = resElements.first().text()
      expect(data).toContain('T R Carter & Sons 1')

      expect(downloadLink.text()).toContain('Download 23 results (.CSV)')
      const downloadLinkHref = downloadLink.attr('href')
      expect(downloadLinkHref).toBeDefined()
      expect(downloadLinkHref?.length).toBeGreaterThan(0)
      expect(downloadLinkHref).toContain('/downloadresults?searchString=Sons')
    })
  })

  test('download csv link is not present on the results page when no results to download', async () => {
    const searchString = 'Daughter'
    const res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
    const $ = cheerio.load(res.payload)
    const downloadLink = $('#downloadResultsLink')

    expect(downloadLink.length).toBe(0)
    const resElements = $('a.govuk-link.govuk-link--no-visited-state')
    expect(resElements.length).toBe(0)
  })
})

test('download all csv link is present on the results page when no results to download', async () => {
  const searchString = 'Daughter'
  const res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))
  const $ = cheerio.load(res.payload)
  const downloadLink = $('#downloadAllLink')
  expect(downloadLink.length).toBe(1)
})

describe('GET /results returns page with dynamic filters', () => {
  test('Get /result returns filterOptions only valid for searchResults', async () => {
    const searchString = 'Son'
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        {
          searchString
        }
      )
    )

    const searchResults = mockData.filter(x => x.payee_name.includes(searchString))
    const $ = cheerio.load(res.payload)

    const filterOptionsFromResults = getFilterOptions(searchResults)
    expect($('#schemesFilter .govuk-checkboxes__item').length).toBe(filterOptionsFromResults.schemes.length)
    expect($('#countiesFilter .govuk-checkboxes__item').length).toBe(filterOptionsFromResults.counties.length)
  })
})

describe('Single result shows "1 Result" (not plural)', () => {
  test('Singular result text is displayed in total and download text', async () => {
    const searchString = 'T R Carter & Sons 22'
    const res = await global.__SERVER__.inject(
      getOptions(
        'results',
        'GET',
        {
          searchString
        }
      )
    )

    mockData.filter(x => x.payee_name.includes(searchString))
    const $ = cheerio.load(res.payload)

    expect($('#totalResults').text()).toMatch('1 result')
    expect($('#downloadResultsLink').text()).toMatch('Download 1 result (.CSV)')
  })
})
