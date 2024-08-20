const cheerio = require('cheerio')
const { expectFooter } = require('../../../../utils/footer-expects')
const { expectHeader } = require('../../../../utils/header-expects')
const { expectPhaseBanner } = require('../../../../utils/phase-banner-expect')
const { getOptions } = require('../../../../utils/helpers')
const { getPageTitle } = require('../../../../../app/utils/helper')
const { expectTitle } = require('../../../../utils/title-expect')
const { expectRelatedContent } = require('../../../../utils/related-content-expects')

const path = 'search'
const pageTitle = getPageTitle(`/${path}`)
jest.mock('../../../../../app/backend/api', () => ({
  getPaymentData: () => ({
    results: [],
    total: 0,
    filterOptions: { schemes: [], amounts: [], counties: [] }
  })
}))

describe('MPDP Search page test', () => {
  test(`GET /${path} route returns search landing page when no query parameters are sent`, async () => {
    const res = await global.__SERVER__.inject(getOptions(path))

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)

    expect($('h1').text()).toEqual(pageTitle)
    expectTitle($, pageTitle)

    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const form = $('#searchForm')
    expect(form.attr('action')).toMatch('/results')
    expect(form.attr('method')).toMatch('get')

    const downloadAllLink = $('#downloadAllLink')
    expect(downloadAllLink.attr('href')).toMatch('/downloadall')
    expect(downloadAllLink.text()).toMatch('download all scheme data (.CSV, 3MB)')

    expect($('.govuk-back-link')).toBeDefined()

    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
    expectRelatedContent($, 'search')
  })

  test('GET /results route returns results page', async () => {
    const searchString = '__TEST_STRING__'
    const res = await global.__SERVER__.inject(getOptions('results', 'GET', { searchString }))

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)

    expect($('h1').text()).toEqual(
      `We found no results for ‘${searchString}’`
    )

    const searchBox = $('#resultsSearchInput')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)

    expect($('#totalResults').text()).toMatch('0 results')

    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })

  test('GET /results with invalid query displays an error', async () => {
    const searchString = ''
    const res = await global.__SERVER__.inject(
      getOptions('results', 'GET', { searchString })
    )

    expect(res.statusCode).toBe(400)
    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(pageTitle)
    const errorSummary = $('#error-summary-title')
    expect(errorSummary).toBeDefined()
    expect(errorSummary.text()).toContain('There is a problem')
    expect($('#resultsSearchInput')).toBeDefined()
    expect($('#relatedContentList li').length).toEqual(1)

    expect($('.govuk-form-group.govuk-form-group--error')).toBeDefined()
    expect($('#search-input-error').text()).toContain('Enter a name or location')
    expect($('title').text()).toContain('Error')
  })
})

describe('MPDP Search page error tests', () => {
  let res
  let $
  beforeAll(async () => {
    res = await global.__SERVER__.inject(
      getOptions('results', 'GET', { searchString: '' })
    )
    $ = cheerio.load(res.payload)
  })

  test('GET /results with invalid query displays an error', async () => {
    expect(res.statusCode).toBe(400)

    expect($('h1').text()).toEqual(pageTitle)
    const errorSummary = $('#error-summary-title')
    expect(errorSummary).toBeDefined()
    expect(errorSummary.text()).toContain('There is a problem')
    expect($('#resultsSearchInput')).toBeDefined()

    expect($('.govuk-form-group.govuk-form-group--error')).toBeDefined()
    expect($('#search-input-error').text()).toContain('Enter a name or location')
    expect($('title').text()).toContain('Error')
  })

  test('Related content is displayed', async () => {
    expect($('#relatedContentList li').length).toEqual(1)
  })
})
