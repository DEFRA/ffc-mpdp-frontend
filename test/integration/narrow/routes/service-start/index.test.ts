import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions } from '../../../../utils/helpers'
import { getPageTitle } from '../../../../../app/utils/helper'
import { expectTitle } from '../../../../utils/title-expect'
import { expectRelatedContent } from '../../../../utils/related-content-expects'

describe('MPDP service start page test', () => {
  const path = 'service-start'
  const expectLinks = ($: cheerio.CheerioAPI) => {
    const expectedLinks = [
      '/downloadall',
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
