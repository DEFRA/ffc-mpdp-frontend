const cheerio = require('cheerio')
const api = require('../../../../../app/backend/api')
const { expectFooter } = require('../../../../utils/footer-expects')
const { expectHeader } = require('../../../../utils/header-expects')
const { expectPhaseBanner } = require('../../../../utils/phase-banner-expect')
const { getOptions, mockGetPaymentDetails } = require('../../../../utils/helpers')
const { expectRelatedContent } = require('../../../../utils/related-content-expects')
const { expectTitle } = require('../../../../utils/title-expect')

jest.spyOn(api, 'getPaymentDetails')
  .mockImplementation(mockGetPaymentDetails)

describe('MPDP Details page tests', () => {
  let res
  let $
  const searchString = 'Carter'
  const page = '1'
  const payeeNameResult = 'T R Carter & Sons 1'
  const partPostcodeResult = 'RG1'

  beforeEach(async () => {
    if (res) { return }

    const options = getOptions('details', 'GET', {
      payeeName: 'Carter',
      partPostcode: 'RG1',
      searchString,
      page
    })

    res = await global.__SERVER__.inject(options)
    $ = cheerio.load(res.payload)
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('GET /details returns status 200', () => {
    expect(res.statusCode).toBe(200)
  })

  test.each([
    '#mpdpSummaryPanel',
    '#mpdpSummaryBreakdown',
    '#mpdpMoreActions',
    '#reportProblem',
    '#toggleButton',
    '#summaryToggle',
    '#showAllButton',
    '#downloaddetailsLink',
    '#schemeMoreInfo1',
    '#schemeMoreInfo2'
  ])('Check for common elements to be present', (id) => {
    expect($(id)).toBeDefined()
  })

  test('Check for common elements content', () => {
    expect($('h1').text()).toContain(searchString)
    expect($('title').text()).toContain(searchString)
    expect($('#dateRange').text()).toMatch('1 April 2021 to 31 March 2023')
    expect($('#totalSchemes').text()).toMatch('Payments from 2 schemes')
    expect($('#totalYears').text()).toMatch('Over 2 financial years')
    expect($('.schemeDetails').length).toBe(2)
    expect($('.schemeActivity').length).toBe(4)
  })

  test.each([
    { id: '#detailsBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results' },
    { id: '#detailsBtmBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results' },
    { id: '#callCharges', href: 'https://www.gov.uk/call-charges', text: 'Find out about call charges' },
    { id: '#sfiQueryForm', href: 'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form', text: 'SFI pilot query form' },
    { id: '#newSearchLink', href: '/search', text: 'start a new search' },
    { id: '#printLink', href: 'window.print()', text: 'print this page' },
    { id: '#downloaddetailsLink', href: `/downloaddetails?payeeName=${encodeURIComponent(payeeNameResult)}&partPostcode=${partPostcodeResult}`, text: 'Download this data (.CSV)' }
  ])('All links are present', async ({ id, href, text }) => {
    const linkElement = $(id)
    expect(linkElement).toBeDefined()
    expect(linkElement.attr('href')).toContain(href)
    expect(linkElement.text()).toMatch(text)
  })

  test('Check for for common elements', () => {
    expectTitle($, 'T R Carter & Sons 1')
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
    expectRelatedContent($, 'details')
  })

  test('GET /details shows validation error when query params are invalid', async () => {
    const invalidOptions = getOptions(
      'details',
      'GET',
      {
        searchString: ''
      }
    )

    const invalidResponse = await global.__SERVER__.inject(invalidOptions)
    const $error = cheerio.load(invalidResponse.payload)
    const errorText = $error('.govuk-error-summary__list li a').text()
    const errorHref = $error('.govuk-error-summary__list li a').attr('href')

    expect(invalidResponse.statusCode).toBe(400)
    expect(errorText).toMatch('Enter a name or location')
    expect(errorHref).toBe('#searchInput')
    expectTitle($error, 'Error: Search for an agreement holder')
    expectRelatedContent($error, 'details')
  })
})
