import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions } from '../../../../utils/helpers'
import { getPageTitle } from '../../../../../app/utils/helper'

jest.mock('../../../../../app/backend/api', () => ({
	getSchemePaymentsByYear: () => ({
			"22/23": [
				{
					"scheme": "Sustainable Farming Incentive Pilot",
					"financial_year": "22/23",
					"total_amount": "3761.00"
				}
			],
			"21/22": [
				{
					"scheme": "Sustainable Farming Incentive Pilot",
					"financial_year": "21/22",
					"total_amount": "1436025.00"
				},
				{
					"scheme": "Farming Equipment and Technology Fund",
					"financial_year": "21/22",
					"total_amount": "1125893.00"
				}
			]
		})
}))

describe('Scheme Payments by years tests', () => {
	let res: any
	let $: cheerio.CheerioAPI
	const path = 'schemePaymentsByYear'

	beforeEach(async () => {
		if(res) { return }
	
		const options = getOptions('schemePaymentsByYear', 'GET')

		res = await global.__SERVER__.inject(options)
		$ = cheerio.load(res.payload)
	})

	afterAll(() => {
		jest.resetAllMocks()
	})

	test(`GET /${path} returns status 200`, () => {
		expect(res.statusCode).toBe(200)
	})

	test.each([
		'#mpdpSummaryPanel',
		'#summaryDetails',
		'#reportProblem',
		'#paymentsByYearSummaryToggle',
		'#showAllYearPaymentsButton',
		'#mpdpMoreActions'
	])('Check for common elements to be present', (id) => {
		expect($(id)).toBeDefined()
	})

	test('Check for common elements content', () => {
		expect($('h1').text()).toContain(getPageTitle(`${path}`))
		expect($('#dateRange').text()).toMatch('1 April 2021 to 31 March 2023')
		expect($('#totalSchemes').text()).toMatch('Payments from 2 schemes')
		expect($('#totalYears').text()).toMatch('Over 2 financial years')
		expect($('.yearlyActivity').length).toBe(2)
		expect($('.schemeActivity').length).toBe(3)		
	})

	test.each([
		{id: '#backLink', href: `/`, text: 'Back'},
		{id: '#btmBackLink', href: `/`, text: 'Back'},
		{id: '#callCharges', href: 'https://www.gov.uk/call-charges', text: 'Find out about call charges'},
		{id: '#sfiQueryForm', href: 'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form', text: 'SFI pilot query form'},
		{id: '#newSearchLink', href: '/search', text: 'start a new search'},
		{id: '#printLink', href: 'window.print()', text: 'print this page'}
	])('All links are present', async ({id, href, text}) => {
		const linkElement = $(id)
		expect(linkElement).toBeDefined()
		expect(linkElement.attr('href')).toContain(href)
		expect(linkElement.text()).toMatch(text)
	})

	test('Check for other common elements', () => {
		expectPhaseBanner($)
		expectFooter($)
		expectHeader($)
	})
})
