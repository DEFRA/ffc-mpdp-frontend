import dummyResults from '../data/mockResults'

export const getOptions = (page: string, method: string = 'GET', params: any = {}) => {
	return {
		method,
		url: `/${page}?${new URLSearchParams(params).toString()}`
	}
}

export const mockGetPaymentData = (searchQuery: string, offset: number, limit: number = 10) => {
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