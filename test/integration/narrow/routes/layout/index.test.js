const cheerio = require('cheerio')
const expectPhaseBanner = require('../../../../utils/phase-banner-expect')
const expectFooter = require('../../../../utils/footer-expects')
const { serviceName } = require('../../../../../app/config')

describe('MPDP layout test', () => {
  test('Primary url route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/'
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
    expect($('title').text()).toEqual(serviceName)
    expectPhaseBanner.ok($)
    expectFooter.toBePresent($)
  })
})
