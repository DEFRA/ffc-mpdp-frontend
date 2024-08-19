const cheerio = require('cheerio')
const { expectPhaseBanner } = require('../../../../utils/phase-banner-expect')
const { expectFooter } = require('../../../../utils/footer-expects')
const { expectHeader } = require('../../../../utils/header-expects')
const { getOptions } = require('../../../../utils/helpers')
const { getPageTitle } = require('../../../../../app/utils/helper')

describe('MPDP layout test', () => {
  test('Primary url route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions(''))

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(getPageTitle('/'))
    const button = $('.govuk-main-wrapper .govuk-button')
    expect(button.attr('href')).toMatch('/search')
    expect(button.text()).toMatch('Start now')
    expect($('title').text()).toMatch(`${getPageTitle('/')} - GOV.UK`)
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })
})
