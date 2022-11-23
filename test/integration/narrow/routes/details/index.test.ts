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

		const res = await global.__SERVER__.inject(
			options
		)

		expect(res.statusCode).toBe(200)
		const $ = cheerio.load(res.payload)
		expect($('h1').text()).toContain(searchString)
		expect($('#reportProblem')).toBeDefined()

		const linkObjs = [
			{id: '#detailsBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results'},
			{id: '#callCharges', href: 'https://www.gov.uk/call-charges', text: 'Find out more about call charges'},
			{id: '#sfiQueryForm', href: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1088945/SFI-query-form.pdf', text: 'query form'},
			{id: '#newSearchLink', href: '/search', text: 'start a new search'},
			{id: '#printLink', href: 'window.print()', text: 'print this page'}
		]

		linkObjs.forEach(obj => {
			const link = $(obj.id)
			expect(link).toBeDefined()
			expect(link.attr('href')).toContain(obj.href)
			expect(link.text()).toMatch(obj.text)
		})

		expectPhaseBanner($)
		expectFooter($)
		expectHeader($)
	})
})