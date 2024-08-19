const cheerio = require('cheerio')
const { expectFooter } = require('../../../../utils/footer-expects')
const { expectHeader } = require('../../../../utils/header-expects')
const { expectPhaseBanner } = require('../../../../utils/phase-banner-expect')
const { getOptions } = require('../../../../utils/helpers')
const { getPageTitle } = require('../../../../../app/utils/helper')
const { expectTitle } = require('../../../../utils/title-expect')
const { expectRelatedContent } = require('../../../../utils/related-content-expects')

describe('MPDP service start page test', () => {
  const path = 'service-start'
  const expectLinks = $ => {
    const expectedLinks = [
      '/downloadalldata',
      'https://cap-payments.defra.gov.uk/Default.aspx'
    ]

    const foundLinks = []
    $('a').each((_index, value) => {
      foundLinks.push($(value).attr('href'))
    })
    expect(
      expectedLinks.every(x => foundLinks.includes(x))
    ).toEqual(true)
  }

  test(`GET /${path} route returns 200`, async () => {
    const res = await global.__SERVER__.inject(getOptions(path))
    expect(res.statusCode).toBe(200)

    const $ = cheerio.load(res.payload)

    const pageTitle = getPageTitle(`/${path}`)
    expect($('h1').text()).toEqual(pageTitle)
    expectTitle($, '')

    const button = $('.govuk-main-wrapper .govuk-button')
    expect(button.attr('href')).toMatch('/search')
    expect(button.text()).toMatch('Start now')
    expect($('#publishedData')).toBeDefined()

    expectLinks($)
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
    expectRelatedContent($, 'service-start')
  })
})
