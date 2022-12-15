import { ResponseObject } from '@hapi/hapi'
import * as cheerio from 'cheerio'

import { getOptions } from '../../../../utils/helpers'
import config from '../../../../../app/config'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'

describe('Cookies route', () => {
  test('GET /cookies route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('cookies'))
    expect(res.statusCode).toBe(200)
  })

  test('GET /cookies returns cookie policy', async () => {
    const result = await global.__SERVER__.inject(getOptions('cookies'))
    const response = result.request.response as ResponseObject
    expect(response.variety).toBe('view')
    expect((response.source as any)?.template).toBe('cookies/cookie-policy')
  })

  test('GET /cookies context includes Header', async () => {
    const result = await global.__SERVER__.inject(getOptions('cookies'))
    expect((result.request.response as any)._payload._data).toContain('Cookies')
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
    const response = await global.__SERVER__.inject(getOptions('cookies'))
    expect(response.statusCode).toBe(200)
    
    const $ = cheerio.load(response.payload)
    expect($('.govuk-cookie-banner h2').text()).toEqual(config.serviceName)
    expect($('.js-cookies-button-accept').text()).toContain('Accept analytics cookies')
    expect($('.js-cookies-button-reject').text()).toContain('Reject analytics cookies')
    expectPhaseBanner($)
  })
})
  