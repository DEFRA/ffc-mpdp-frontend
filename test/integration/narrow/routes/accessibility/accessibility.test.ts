import { getOptions } from '../../../../utils/helpers'
import * as cheerio from 'cheerio'
import { getPageTitle } from '../../../../../app/utils/helper'
import { expectTitle } from '../../../../utils/title-expect'
import { expectRelatedContent } from '../../../../utils/related-content-expects';

describe('MPDP Accessibility page test', () => {
  const path = '/accessibility'
  let $: cheerio.CheerioAPI;

  test(`GET ${path} route returns 200`, async () => {
    const res = await global.__SERVER__.inject(getOptions('accessibility'))
    expect(res.statusCode).toBe(200)

    $ = cheerio.load(res.payload)
    const pageTitle = getPageTitle(path)
    expect($('h1').text()).toMatch(pageTitle)
    expectTitle($, pageTitle)
  })
  
  test('Check for for common elements', () => {
    expectRelatedContent($, 'accessibility-policy');
  })
})
