import * as cheerio from 'cheerio'
import { expectFooter } from '../../../../utils/footer-expects'
import { expectHeader } from '../../../../utils/header-expects'
import { expectPhaseBanner } from '../../../../utils/phase-banner-expect'
import { getOptions, mockGetPaymentDetails } from '../../../../utils/helpers'

jest.mock('../../../../../app/backend/api', () => ({
	getPaymentDetails: mockGetPaymentDetails
  }))

describe('MPDP Details page tests', () => {
	let res: any
	let $: cheerio.CheerioAPI
	const searchString = 'Carter'
	const page = '1'
	
	beforeEach(async () => {
		if(res) { return }
	
		const options = getOptions('details', 'GET', {
			payeeName: 'Carter',
			partPostcode: 'SD1',
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

	test('Check for common elements to be present', () => {
		expect($('h1').text()).toContain(searchString)
		expect($('#mpdpSummaryPanel')).toBeDefined()
		expect($('#mpdpSummaryBreakdown')).toBeDefined()
		expect($('#mpdpMoreActions')).toBeDefined()
		expect($('#reportProblem')).toBeDefined()
		expect($('#dateRange').text()).toMatch('From 1 April 2021 to 31 March 2022')

	})

	test.each([
		{id: '#detailsBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results'},
		{id: '#detailsBtmBackLink', href: `/results?searchString=${searchString}&page=${page}`, text: 'Back to results'},
		{id: '#callCharges', href: 'https://www.gov.uk/call-charges', text: 'Find out more about call charges'},
		{id: '#sfiQueryForm', href: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1088945/SFI-query-form.pdf', text: 'query form'},
		{id: '#newSearchLink', href: '/search', text: 'start a new search'},
		{id: '#printLink', href: 'window.print()', text: 'print this page'}
	])('All links are present', async ({id, href, text}) => {
		
		const linkElement = $(id)
		expect(linkElement).toBeDefined()
		expect(linkElement.attr('href')).toContain(href)
		expect(linkElement.text()).toMatch(text)
	})

	test('Check for header and footer', () => {
		expectPhaseBanner($)
		expectFooter($)
		expectHeader($)
	})
})