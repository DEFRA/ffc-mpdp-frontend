import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions, mockGetPaymentDetails } from '../../../../utils/helpers'
import { expectRelatedContent } from '../../../../utils/related-content-expects'

jest.mock('../../../../../app/backend/api', () => ({
	getPaymentDetails: mockGetPaymentDetails
  }))

describe('MPDP Details page tests', () => {
	let res: any
	let $: cheerio.CheerioAPI
	const searchString = 'Carter'
	const page = '1'
	const payeeNameResult = 'T R Carter & Sons 1'
	const partPostcodeResult= 'RG1'

	beforeEach(async () => {
		if(res) { return }
	
		const options = getOptions('details', 'GET', {
			payeeName: 'Carter',
			partPostcode: 'RG1',
			searchString,
			page
		})

		res = await global.__SERVER__.inject(options)
		$ = cheerio.load(res.payload)
	})

	afterAll(() => {
		jest.resetAllMocks()
	})

	test('GET /details returns status 200', () => {
		expect(res.statusCode).toBe(200)
	})

	test.each([
		'#mpdpSummaryPanel',
		'#mpdpSummaryBreakdown',
		'#mpdpMoreActions',
		'#reportProblem',
		'#toggleButton',
		'#summaryToggle',
		'#showAllButton',
		'#downloaddetailsLink',
		'#schemeMoreInfo1',
		'#schemeMoreInfo2'
	])('Check for common elements to be present', (id) => {
		expect($(id)).toBeDefined()
	})

	test('Check for common elements content', () => {
		expect($('h1').text()).toContain(searchString)
		expect($('title').text()).toContain(searchString)
		expect($('#dateRange').text()).toMatch('1 April 2021 to 31 March 2023')
		expect($('#totalSchemes').text()).toMatch('Payments from 2 schemes')
		expect($('#totalYears').text()).toMatch('Over 2 financial years')
		expect($('.schemeDetails').length).toBe(2)
		expect($('.schemeActivity').length).toBe(4)		
	})

	test.each([
		{id: '#detailsBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results'},
		{id: '#detailsBtmBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results'},
		{id: '#callCharges', href: 'https://www.gov.uk/call-charges', text: 'Find out about call charges'},
		{id: '#sfiQueryForm', href: 'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form', text: 'SFI pilot query form'},
		{id: '#newSearchLink', href: '/search', text: 'start a new search'},
		{id: '#printLink', href: 'window.print()', text: 'print this page'},
		{id: '#downloaddetailsLink', href: `/downloaddetails?payeeName=${encodeURIComponent(payeeNameResult)}&partPostcode=${partPostcodeResult}`, text: 'Download this data (.CSV)'}
	])('All links are present', async ({id, href, text}) => {
		const linkElement = $(id)
		expect(linkElement).toBeDefined()
		expect(linkElement.attr('href')).toContain(href)
		expect(linkElement.text()).toMatch(text)
	})

	test('Check for for common elements', () => {
		expectPhaseBanner($)
		expectFooter($)
		expectHeader($)
		expectRelatedContent($, 'details');
	})
})