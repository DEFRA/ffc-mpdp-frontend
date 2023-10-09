import { ResponseObject } from '@hapi/hapi'
import * as cheerio from 'cheerio'

import { getOptions } from '../../../../utils/helpers'
import config from '../../../../../app/config'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getPageTitle } from '../../../../../app/utils/helper'
import { expectTitle } from '../../../../utils/title-expect'

describe('Cookies route', () => {
  test('GET /cookies route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('cookies'))
    const $ = cheerio.load(res.payload)
    
    expect(res.statusCode).toBe(200)
    expectTitle($, `${getPageTitle('/cookies')}`)
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

  test('POST /cookies returns cookie page with updated settings if not async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true }
    }

    const response = await global.__SERVER__.inject(options)

    const $ = cheerio.load(response.payload)
    expect($('#govuk-notification-banner-title').text()).toContain('Success')
    expect($('.govuk-notification-banner__heading').text()).toEqual('You’ve set your cookie preferences.')
    expect($('#analytics').val()).toEqual('true')

    expect(response.statusCode).toBe(200)
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

  test('Cookie banner appears when no cookie option selected', async () => {
    const response = await global.__SERVER__.inject(getOptions('cookies'))
    expect(response.statusCode).toBe(200)
    
    const $ = cheerio.load(response.payload)
    expect($('.govuk-cookie-banner h2').text()).toEqual(`Cookies on ${config.serviceName}`)
    expect($('.js-cookies-button-accept').text()).toContain('Accept analytics cookies')
    expect($('.js-cookies-button-reject').text()).toContain('Reject analytics cookies')
    expectPhaseBanner($)
  })
})
  