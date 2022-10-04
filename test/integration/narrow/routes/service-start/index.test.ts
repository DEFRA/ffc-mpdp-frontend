import * as cheerio from 'cheerio'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'

describe('MPDP service start page test', () => {
  test('GET /service-start route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/service-start'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('.govuk-heading-l').text()).toEqual(
      'Service Start Page'
    )
    const button = $('.govuk-main-wrapper .govuk-button')
    expect(button.attr('href')).toMatch('/mpdp/search')
    expect(button.text()).toMatch('Start now')
    expectPhaseBanner($)
  })
})
