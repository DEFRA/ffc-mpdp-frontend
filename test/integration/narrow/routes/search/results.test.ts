import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'

import mockData from '../../../../../app/backend/data/mockResults'

describe('GET /search route with query parameters return results page', () => {
  const searchString = 'Sons'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }

    res = await global.__SERVER__.inject({
      method: 'GET',
      url: `/search?searchString=${searchString}`
    })
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

    const searchBox = $('#searchBox')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)
  })

  test('Next button on pagination is present on the results page', () => {
    const nextBtn = $('#nextOption')
    expect(nextBtn).toBeDefined()
  })

  test('Results are displayed on the page upto the limit of 10', () => {
    const resElements = $('.govuk-link.govuk-link--no-underline.govuk-link--no-visited-state')
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

describe('GET /search route with pagination return new result with each page', () => {
  const searchString = 'Sons'
  let res: any
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
    if(res) { return }

    res = await global.__SERVER__.inject({
      method: 'GET',
      url: `/search?searchString=${searchString}&page=3`
    })
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

    const searchBox = $('#searchBox')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)
  })

  test('Next and previous buttons on pagination is present on the results page', () => {
    const nextBtn = $('#nextOption')
    expect(nextBtn).toBeDefined()

    const prevBtn = $('#prevOption')
    expect(prevBtn).toBeDefined()
  })

  test('Page 3 only shows the 2 remaining results from dummy data', () => {
    const resElements = $('.govuk-link.govuk-link--no-underline.govuk-link--no-visited-state')
    expect(resElements.length).toBe(2)
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

    res = await global.__SERVER__.inject({
      method: 'GET',
      url: `/search?searchString=${searchString}&page=3`
    })
    $ = cheerio.load(res.payload)
  })

  test('Results heading contains no results found with searchString', () => {
    expect($('.govuk-heading-l').text()).toEqual(
      `We found no results for ‘${searchString}’`
    )
  })

  test('Search box is present on the results page', () => {
    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const searchBox = $('#searchBox')
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