import { getOptions } from '../../../../utils/helpers'
import * as cheerio from 'cheerio'
import { getPageTitle } from '../../../../../app/utils/helper'
import { expectTitle } from '../../../../utils/title-expect'

describe('MPDP Accessibility page test', () => {
  const path = '/accessibility'
  test(`GET ${path} route returns 200`, async () => {
    const res = await global.__SERVER__.inject(getOptions('accessibility'))
    expect(res.statusCode).toBe(200)

    const $ = cheerio.load(res.payload)
    const pageTitle = getPageTitle(path)
    expect($('h1').text()).toMatch(pageTitle)
    expectTitle($, pageTitle)
  })
})
