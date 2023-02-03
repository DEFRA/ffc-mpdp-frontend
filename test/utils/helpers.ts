import dummyResults from '../data/mockResults'
import mockDetails from '../data/mockDetails'

export const getOptions = (page: string, method: string = 'GET', params: any = {}) => {
	return {
		method,
		url: `/${page}?${new URLSearchParams(params).toString()}`
	}
}

export const mockGetPaymentData = (searchQuery: string, offset: number, sortBy:string, limit: number = 10) => {
	const results = dummyResults.filter(x =>
		x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

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
