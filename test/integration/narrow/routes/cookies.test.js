const cheerio = require('cheerio')
const { serviceName } = require('../../../../app/config')
const expectPhaseBanner = require('../../../utils/phase-banner-expect')

describe('cookies route', () => {
  test('GET /cookies returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /cookies returns cookie policy', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('cookies/cookie-policy')
  })

  test('GET /cookies context includes Header', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response._payload._data).toContain('Cookies')
  })

  test('POST /cookies returns 302 if not async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
  })

  test('POST /cookies returns 200 if async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true, async: true }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /cookies invalid returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { invalid: 'aaaaaa' }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /cookies redirects to GET with querystring', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe('/cookies?updated=true')
  })

  test('Cookie banner appears when no cookie option selected', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const $ = cheerio.load(response.payload)
    expect($('.govuk-cookie-banner h2').text()).toEqual(serviceName)
    expect($('.js-cookies-button-accept').text()).toContain('Accept analytics cookies')
    expect($('.js-cookies-button-reject').text()).toContain('Reject analytics cookies')
    expectPhaseBanner.ok($)
  })
})
