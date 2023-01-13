import * as cheerio from 'cheerio'
import { getOptions } from '../../../../utils/helpers'

describe('MPDP Privacy page test', () => {
  let res: any;
  let $: cheerio.CheerioAPI

  beforeEach(async () => {
		if(res) { return }

    res = await global.__SERVER__.inject(getOptions('privacy'))
    $ = cheerio.load(res.payload)
  })

  afterAll(() => {
		jest.resetAllMocks()
	})

  test('GET /privacy route returns 200', async () => {
    expect(res.statusCode).toBe(200)
  })

  test.each([
		{id: '#ppGovLink', href: `https://www.gov.uk/`, text: 'GOV.UK'},
		{id: '#charterLink', href: `https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs/about/personal-information-charter`, text: 'personal information charter'},
		{id: '#ppMailToLink', href: 'mailto:defra.helpline@defra.gov.uk', text: 'defra.helpline@defra.gov.uk'},
		{id: '#ppBrowsersLink', href: 'https://www.gov.uk/support/browsers', text: 'web browser'},
		{id: '#ppEEALink', href: 'https://www.gov.uk/eu-eea', text: 'European Economic Area (EEA)'},
		{id: '#ppCookiesLink', href: 'https://www.gov.uk/help/cookies', text: 'Find out more about cookies and how to manage them'}
	])('All links are present', async ({id, href, text}) => {
		
		const linkElement = $(id)
		expect(linkElement).toBeDefined()
		expect(linkElement.attr('href')).toContain(href)
		expect(linkElement.text()).toMatch(text)
	})
})
  