import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions } from '../../../../utils/helpers'

describe('MPDP Details page tests', () => {
	test('GET /details route returns summary', async () => {
		const searchString = 'Carter'
		const page = '1'
		const options = getOptions('details', 'GET', {
			payeeName: 'Carter',
			searchString,
			page
		})
		console.log(options)

		const res = await global.__SERVER__.inject(
			options
		)

		expect(res.statusCode).toBe(200)
		const $ = cheerio.load(res.payload)
		expect($('h1').text()).toContain(searchString)

		const backLink = $('#detailsBackLink')
		expect(backLink).toBeDefined()
		expect(backLink.attr('href')).toContain(`/results?searchString=${searchString}&page=${page}`)
		expect(backLink.text()).toMatch('Back to results')

		expectPhaseBanner($)
		expectFooter($)
		expectHeader($)
	})
})