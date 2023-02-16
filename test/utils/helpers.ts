import dummyResults from '../data/mockResults'
import mockDetails from '../data/mockDetails'
import { object } from 'joi'

export const getOptions = (page: string, method: string = 'GET', params: any = {}) => {
	return {
		method,
		url: `/${page}?${new URLSearchParams(params).toString()}`
	}
}

const removeFilterFields = (searchResults: typeof dummyResults) => searchResults.map(({scheme, ...rest}) => rest)

export const mockGetPaymentData = (searchQuery: string, offset: number, filterBy: any, sortBy:string, limit: number = 10) => {
	let searchResults = dummyResults.filter(x =>
		x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

	if(filterBy.schemes && filterBy.schemes.length) {
		searchResults = searchResults.filter(x => filterBy.schemes.includes(x.scheme))
	}

	let results = removeFilterFields(searchResults)
	
	if(!results) {
		return {
			results: [],
			total: 0
		}
	}

	// Sort the results by the sortBy field
	const keys = ['payee_name', 'part_postcode', 'town', 'county_council']
  	if (keys.includes(sortBy)) {
		results = results.sort((r1, r2) => r1[sortBy as keyof typeof object] > r2[sortBy as keyof typeof results[0]] ? 1 : -1)
  	}
	// split the results into pages
	return { 
		results: results.slice(offset, offset + limit),
		total: results.length
	}
}

export const mockGetPaymentDetails = (payee_name: string) => 
	mockDetails.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))

export const trimExtraSpaces = (str: string) => str.trim().replace(/\s{2,}/g, ' ')
