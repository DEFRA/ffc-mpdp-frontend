import dummyResults from '../data/mockResults'
import mockDetails from '../data/mockDetails'

export const getOptions = (page: string, method: string = 'GET', params: any = {}, listParams: {[key: string]: string[]} = {}) => {
	const urlParams = new URLSearchParams(params);
	for(let key in listParams) {
		listParams[key].forEach(value => {
			urlParams.append(key, value)
		})
	}

	return {
		method,
		url: `/${page}?${urlParams.toString()}`
	}
}

const removeFilterFields = (searchResults: typeof dummyResults) => searchResults.map(({scheme, ...rest}) => rest)

export const mockGetPaymentData = (searchQuery: string, offset: number, filterBy: any, limit: number = 10) => {
	let searchResults = dummyResults.filter(x =>
		x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

	searchResults = filterBySchemes(searchResults, filterBy.schemes)
	searchResults = filterByAmounts(searchResults, filterBy.amounts)

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

export const filterBySchemes = (results: any, schemes: string[]) => {
	if (!schemes || !schemes.length) {
	  return results
	}
	
	return results.filter((x: any) => schemes.includes(x.scheme))
  }

export const filterByAmounts = (results: any, amounts: string[]) => {
	if(!amounts || !amounts.length) {
	  return results
	}
  
	const amountRanges = amounts.map(x => {
	  const [_from, _to] = x.split('-')
	  return { from: parseFloat(_from), to: parseFloat(_to)}
	})
  
	return results.filter((x: any) => {
	  return amountRanges.some(({ from, to }) => {
		const totalAmount = parseFloat(x.amount)
  
		if(!to) {
		  return totalAmount >= from
		}
		else if(totalAmount >= from && totalAmount <= to) {
		  return true;
		}
  
		return false
	  })
	})
  }

export const mockGetPaymentDetails = (payee_name: string) => 
	mockDetails.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))

export const trimExtraSpaces = (str: string) => str.trim().replace(/\s{2,}/g, ' ')
