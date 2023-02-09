import dummyResults from '../data/mockResults'
import mockDetails from '../data/mockDetails'

export const getOptions = (page: string, method: string = 'GET', params: any = {}) => {
	return {
		method,
		url: `/${page}?${new URLSearchParams(params).toString()}`
	}
}

const removeFilterFields = (searchResults: typeof dummyResults) => searchResults.map(({scheme, ...rest}) => rest)

export const mockGetPaymentData = (searchQuery: string, offset: number, filterBy: any, limit: number = 10) => {
	let searchResults = dummyResults.filter(x =>
		x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

	if(filterBy.schemes && filterBy.schemes.length) {
		searchResults = searchResults.filter(x => filterBy.schemes.includes(x.scheme))
	}

	const results = removeFilterFields(searchResults)
	
	if(!results) {
		return {
			results: [],
			total: 0
		}
	}

	return { 
		results: results.slice(offset, offset + limit),
		total: results.length
	}
}

export const mockGetPaymentDetails = (payee_name: string) => 
	mockDetails.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))

export const trimExtraSpaces = (str: string) => str.trim().replace(/\s{2,}/g, ' ')
