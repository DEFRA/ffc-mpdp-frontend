import dummyResults from '../data/mockResults'
import mockDetails from '../data/mockDetails'
import { object } from 'joi'

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
export const getFilterOptions = (searchResults: typeof dummyResults) => {
	if (!searchResults || !searchResults.length) {
		return { schemes: [], amounts: [], counties: [], years: [] };
	}

	return {
		schemes: getUniqueFields(searchResults, 'scheme'),
		counties: getUniqueFields(searchResults, 'county_council'),
		amounts: getUniqueFields(searchResults, 'amount'),
		years: getUniqueFields(searchResults, 'year'),
	};
};

const getUniqueFields = (searchResults: typeof dummyResults, field: string) => {
	return Array.from(new Set(searchResults.map((result: any) => result[field])));
};

export const mockGetPaymentData = (searchQuery: string, offset: number, filterBy: any, sortBy: string, limit: number = 10) => {
	let searchResults = dummyResults.filter(x =>
		x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

	const filterOptions = getFilterOptions(searchResults)

	searchResults = filterBySchemes(searchResults, filterBy.schemes)
	searchResults = filterByAmounts(searchResults, filterBy.amounts)
	searchResults = filterByCounties(searchResults, filterBy.counties)
	searchResults = filterByYears(searchResults, filterBy.years)

	let results = removeFilterFields(searchResults)
	
	if(!results) {
		return {
			results: [],
			total: 0,
			filterOptions: []
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
		total: results.length,
		filterOptions
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
			return (!to)? (totalAmount >= from) : (totalAmount >= from && totalAmount <= to)
	  })
	})
  }

export const filterByCounties = (results: any, counties: string[]) => {
	if (!counties || !counties.length) {
	  return results
	}
	
	return results.filter((x: any) => counties.includes(x.county_council))
}

export const filterByYears = (results: any, years: string[]) => {
	if (!years || !years.length) {
	  return results
	}
	
	return results.filter((x: any) => years.includes(x.year))
}

export const mockGetPaymentDetails = (payee_name: string) => 
	mockDetails.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))

export const trimExtraSpaces = (str: string) => str.trim().replace(/\s{2,}/g, ' ')
