import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'

describe('MPDP Search page test', () => {
  test('GET /search route returns search landing page when no query parameters are sent', async () => {
    const options = {
      method: 'GET',
      url: '/search'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(
      'Enter a business or payee name'
    )

    const button = $('.govuk-button')
    expect(button).toBeDefined()
    expect(button.text()).toMatch('Search')

    const form = $('#searchForm')
    expect(form.attr('action')).toMatch('/search')
    expect(form.attr('method')).toMatch('post')

    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })

  test('POST /search route returns results page', async () => {
    const searchString = '__TEST_STRING__'
    const options = {
      method: 'POST',
      url: '/search',
      payload: {
        searchString
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    
    expect($('h1').text()).toEqual(
      `We found no results for ‘${searchString}’`
    )

    const searchBox = $('#searchInput')
    expect(searchBox).toBeDefined()
    expect(searchBox.val()).toMatch(searchString)

    expect($('#totalResults').text()).toMatch(`0 results`)

    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })

  test('POST /search with invalid payload displays an error', async () => {
    const options = {
      method: 'POST',
      url: '/search',
      payload: {
        searchString: ''
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(400)
    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(
      'Enter a business or payee name'
    )
    const errorSummary = $('#error-summary-title')
    expect(errorSummary).toBeDefined()
    expect(errorSummary.text()).toContain('There is a problem')
    expect($('#searchInput')).toBeDefined()

    expect($('.govuk-form-group.govuk-form-group--error')).toBeDefined()
    expect($('#search-input-error').text()).toContain('Enter a search term')
  })
})
