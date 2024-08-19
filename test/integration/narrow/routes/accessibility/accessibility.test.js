const { getOptions } = require('../../../../utils/helpers')
const cheerio = require('cheerio')
const { getPageTitle } = require('../../../../../app/utils/helper')
const { expectTitle } = require('../../../../utils/title-expect')
const { expectRelatedContent } = require('../../../../utils/related-content-expects')

describe('MPDP Accessibility page test', () => {
  const path = '/accessibility'
  let $

  test(`GET ${path} route returns 200`, async () => {
    const res = await global.__SERVER__.inject(getOptions('accessibility'))
    expect(res.statusCode).toBe(200)

    $ = cheerio.load(res.payload)
    const pageTitle = getPageTitle(path)
    expect($('h1').text()).toMatch(pageTitle)
    expectTitle($, pageTitle)
  })

  test('Check for for common elements', () => {
    expectRelatedContent($, 'accessibility-policy')
  })
})
