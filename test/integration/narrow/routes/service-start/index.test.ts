import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions } from '../../../../utils/helpers'
import { getPageTitle } from '../../../../../app/utils/helper'

describe('MPDP service start page test', () => {
  const path = 'service-start'
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

  test(`GET /${path} route returns 200`, async () => {
    const res = await global.__SERVER__.inject(getOptions(path))
    expect(res.statusCode).toBe(200)

    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(getPageTitle(`/${path}`))

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
