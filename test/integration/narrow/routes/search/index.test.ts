import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'

describe('MPDP Search page test', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('GET /search route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/search'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('.govuk-heading-l').text()).toEqual(
      'Search for a business or payee name'
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

  test('POST /search route returns 200', async () => {
    const options = {
      method: 'POST',
      url: '/search',
      payload: {
        searchString: 'searchString'
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('.govuk-heading-l').text()).toEqual(
      'Search for a business or payee name'
    )

    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })

  test('POST /search with invalid payload redirects back to search page', async () => {
    const options = {
      method: 'POST',
      url: '/search',
      payload: {
        searchString: 1234
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(400)
    const $ = cheerio.load(res.payload)
    expect($('.govuk-heading-l').text()).toEqual(
      'Search for a business or payee name'
    )
  })
})
