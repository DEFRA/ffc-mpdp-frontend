import config from '../../../../../app/config'
import * as cheerio from 'cheerio'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { getOptions } from '../../../../utils/helpers'
import { getPageTitle } from '../../../../../app/utils/helper'

describe('MPDP layout test', () => {
  test('Primary url route returns 200', async () => {
    const res = await global.__SERVER__.inject(getOptions(''))

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('h1').text()).toEqual(getPageTitle('/'))
    const button = $('.govuk-main-wrapper .govuk-button')
    expect(button.attr('href')).toMatch('/search')
    expect(button.text()).toMatch('Start now')
    expect($('title').text()).toEqual(config.serviceName)
    expectPhaseBanner($)
    expectFooter($)
    expectHeader($)
  })
})
