const dummyResults = require('../data/mockResults')
const mockDetails = require('../data/mockDetails')

const getOptions = (page, method = 'GET', params = {}, listParams = {}) => {
  const urlParams = new URLSearchParams(params)
  for (const key in listParams) {
    listParams[key].forEach(value => {
      urlParams.append(key, value)
    })
  }

  return {
    method,
    url: `/${page}?${urlParams.toString()}`
  }
}

const removeFilterFields = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)
const getFilterOptions = (searchResults) => {
  if (!searchResults || !searchResults.length) {
    return { schemes: [], amounts: [], counties: [], years: [] }
  }

  return {
    schemes: getUniqueFields(searchResults, 'scheme'),
    counties: getUniqueFields(searchResults, 'county_council'),
    amounts: getUniqueFields(searchResults, 'amount'),
    years: getUniqueFields(searchResults, 'year')
  }
}

const getUniqueFields = (searchResults, field) => {
  return Array.from(new Set(searchResults.map((result) => result[field])))
}

const mockGetPaymentData = (searchQuery, offset, filterBy, sortBy, limit = 10) => {
  let searchResults = dummyResults.filter(x =>
    x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filterOptions = getFilterOptions(searchResults)

  searchResults = filterBySchemes(searchResults, filterBy.schemes)
  searchResults = filterByAmounts(searchResults, filterBy.amounts)
  searchResults = filterByCounties(searchResults, filterBy.counties)
  searchResults = filterByYears(searchResults, filterBy.years)

  let results = removeFilterFields(searchResults)

  if (!results) {
    return {
      results: [],
      total: 0,
      filterOptions: []
    }
  }

  // Sort the results by the sortBy field
  const keys = ['payee_name', 'part_postcode', 'town', 'county_council']
  if (keys.includes(sortBy)) {
    results = results.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
  }
  // split the results into pages
  return {
    results: results.slice(offset, offset + limit),
    total: results.length,
    filterOptions
  }
}

const filterBySchemes = (results, schemes) => {
  if (!schemes || !schemes.length) {
    return results
  }

  return results.filter(x => schemes.includes(x.scheme))
}

const filterByAmounts = (results, amounts) => {
  if (!amounts || !amounts.length) {
    return results
  }

  const amountRanges = amounts.map(x => {
    const [_from, _to] = x.split('-')
    return { from: parseFloat(_from), to: parseFloat(_to) }
  })

  return results.filter(x => {
    return amountRanges.some(({ from, to }) => {
      const totalAmount = parseFloat(x.amount)
      return (!to) ? (totalAmount >= from) : (totalAmount >= from && totalAmount <= to)
    })
  })
}

const filterByCounties = (results, counties) => {
  if (!counties || !counties.length) {
    return results
  }

  return results.filter(x => counties.includes(x.county_council))
}

const filterByYears = (results, years) => {
  if (!years || !years.length) {
    return results
  }

  return results.filter(x => years.includes(x.year))
}

/* eslint-disable camelcase */
const mockGetPaymentDetails = payee_name =>
  mockDetails.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))
/* eslint-enable camelcase */

const trimExtraSpaces = str => str.trim().replace(/\s{2,}/g, ' ')

module.exports = {
  getOptions,
  getFilterOptions,
  mockGetPaymentData,
  filterBySchemes,
  filterByAmounts,
  filterByCounties,
  filterByYears,
  mockGetPaymentDetails,
  trimExtraSpaces
}
