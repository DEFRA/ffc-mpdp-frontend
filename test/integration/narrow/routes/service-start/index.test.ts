import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions } from '../../../../utils/helpers'

describe('MPDP service start page test', () => {

  const expectLinks = ($: cheerio.CheerioAPI) => {
    const expectedLinks = [
      '/downloadall',
      'https://www.gov.uk/government/collections/sustainable-farming-incentive-guidance',
      'https://www.gov.uk/guidance/farming-equipment-and-technology-fund-round-1-manual',
      'https://www.gov.uk/guidance/tree-health-pilot-scheme',
      'https://cap-payments.defra.gov.uk/Default.aspx'
    ]

    const foundLinks: (string | undefined)[] = []
    $('a').each((_index, value) => {
      foundLinks.push($(value).attr('href'))
    })
    expect(
      expectedLinks.every(x => foundLinks.includes(x))
    ).toEqual(true)
  }

  test('GET /service-start route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions('service-start'))
    expect(res.statusCode).toBe(200)

    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(
      'Find data on farm and land payments'
    )

    const button = $('.govuk-main-wrapper .govuk-button')
    expect(button.attr('href')).toMatch('/search')
    expect(button.text()).toMatch('Start now')
    expect($('#publishedData')).toBeDefined()

    expectLinks($)
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })
})
