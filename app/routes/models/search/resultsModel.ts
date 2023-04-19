import config from '../../../config'
import { getPaymentData } from '../../../backend/api'
import { amounts as staticAmounts } from '../../../data/filters/amounts'
import { counties as staticCounties } from '../../../data/filters/counties'
import { sortByItems } from '../../../data/sortByItems'

import { getReadableAmount, getAllSchemesNames, getMatchingStaticAmounts } from '../../../utils/helper'

const getTags = (query: any) => {
  const tags = {
    Scheme: getAllSchemesNames().reduce((acc, scheme) => {
      if(query.schemes?.includes(scheme)) {
        acc.push({
					text: scheme,
					value: scheme
        })
      }
      
      return acc
    }, new Array<{
        text: string, 
        value: string
    }>),
    Amount: staticAmounts.reduce((acc, amount) => {
      if((typeof query.amounts === 'string')? query.amounts === amount.value : query.amounts?.includes(amount.value)) {
        const amountParts = amount.text.split('to')
        const text = (amountParts[1] === undefined) ? amountParts[0] : `Between ${amountParts[0].trim()} and ${amountParts[1].trim()}`
        acc.push({
					text,
					value: amount.value
				})
      }

      return acc
    }, new Array<{
        text: string, 
        value: string
	  }>),
    County: staticCounties.reduce((acc, county) => {
      if((typeof query.counties === 'string')? query.counties === county : query.counties?.includes(county)) {
        acc.push({
					text: county,
					value: county
				})
      }

      return acc
    }, new Array<{
        text: string, 
        value: string
	  }>)
  }

  let key: keyof typeof tags
  for(key in tags) {
    if(tags[key].length == 0) {
      delete tags[key]
    }
  }

  return tags;
}

const getFilters = (query: any, filterOptions: { schemes: string[], amounts: any[], counties: string[] }) => {
  const schemesLength = !query.schemes? 0 : (typeof query.schemes === 'string'? 1: query.schemes?.length)
  const amountsLength = !query.amounts? 0 : (typeof query.amounts === 'string'? 1: query.amounts?.length)
  const countiesLength = !query.counties? 0 : (typeof query.counties === 'string'? 1: query.counties?.length)
  const attributes = {
    onchange: "this.form.submit()"
  }

  return {
    schemes: {
      name: 'Scheme',
      items: getSchemes(filterOptions.schemes).map(scheme => ({ 
        text: scheme, 
        value: scheme,
        checked: isChecked(query.schemes, scheme),
        attributes
      })),
      selected: schemesLength
    },
    amounts: {
      name: 'Amount',
      items: getAmounts(filterOptions.amounts).map(({text, value}) => ({
        text,
        value,
        checked: isChecked(query.amounts, value),
        attributes
      })),
      selected: amountsLength
    },
    counties: {
      name: 'County',
      items: getCounties(filterOptions.counties).map((county) => ({
        text: county,
        value: county,
        checked: isChecked(query.counties, county),
        attributes
      })),
      selected: countiesLength
    }
  }
}

const getSchemes = (schemes: string[]) => schemes?.length ? schemes : getAllSchemesNames()

const getAmounts = (amounts: any[]) => amounts?.length ? amounts : staticAmounts

const getCounties = (counties: any[]) => counties?.length ? counties : staticCounties

const isChecked = (field: string | string[], value: string) => (typeof field === 'string')? field === value : field?.includes(value)

const getSortByModel = (query: any) => ({
    selected: decodeURIComponent(query.sortBy),
    items: sortByItems
})

const getPaginationAttributes = (totalResults: number, requestedPage: number, searchString: string, filterBy: any, sortBy: string) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)

  let prevHref = `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`
  let nextHref = `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`
  for(let key in filterBy) {
    if(filterBy[key].length) {
      const urlParam = `&${key}=`
      const urlPart = `${urlParam}${filterBy[key].join(urlParam)}`
      prevHref += urlPart
      nextHref += urlPart 
    }
  }

  if(sortBy) {
    const encodedSortBy = encodeURIComponent(sortBy)
    prevHref += `&sortBy=${encodedSortBy}`
    nextHref += `&sortBy=${encodedSortBy}`
  }
  
  const previous = requestedPage <= 1 ? null : {
    href: prevHref,
    labelText: `${requestedPage - 1} of ${totalPages} `,
    attributes: {
      id: 'prevOption',
      "aria-label": "Go to previous page of results: " + `${requestedPage - 1} of ${totalPages} `
    }
  }

  const next = totalPages <= 1 || totalPages === requestedPage ? null : {
    href: nextHref,
    labelText: `${requestedPage + 1} of ${totalPages} `,
    attributes: {
      id: 'nextOption',
      "aria-label": "Go to next page of results: " + `${requestedPage + 1} of ${totalPages} `
    }
  }

  return { previous, next }
}

const performSearch = async (searchString: string, requestedPage: number, filterBy: any, sortBy: string) => {
  const offset = (requestedPage - 1) * config.search.limit
  const searchResults = await getPaymentData(searchString, offset, filterBy, sortBy)
  return {
    ...searchResults,
    results: searchResults.results?.map((x: any) => ({...x, amount: getReadableAmount(parseFloat(x.total_amount))}))
  }
}

export const resultsModel = async (query: any, error?: any) => {
  const searchString = decodeURIComponent(query.searchString)
  const defaultReturn = {
    hiddenInputs: [
      { id: 'pageId', name: 'pageId', value: 'results' },
      { id: 'sortBy', name: 'sortBy', value: 'score' }
    ],
    tags: getTags(query),
    sortBy: getSortByModel(query)
  }
  
  if(error) {
    return {
      ...defaultReturn,
      filters: getFilters(query, {
        schemes: getAllSchemesNames(),
        amounts: staticAmounts,
        counties: staticCounties
      }),
      errorList: [{
        text: "Enter a search term",
        href: "#resultsSearchInput"
      }],
      headingTitle: `Results for ‘${searchString}’`,
      total: 0
    }
  }

  const sortBy = decodeURIComponent(query.sortBy)
  const requestedPage = query.page
  const filterBy = {
    schemes: typeof query.schemes === 'string' ? [query.schemes]: query.schemes,
    amounts: typeof query.amounts === 'string' ? [query.amounts]: query.amounts,
    counties: typeof query.counties === 'string' ? [query.counties]: query.counties
  }

  const { results, total, filterOptions } = await performSearch(searchString, requestedPage, filterBy, sortBy)
  const amounts = getMatchingStaticAmounts(filterOptions?.amounts)

  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, filterBy, sortBy),
    filters: getFilters(query, {...filterOptions, amounts}),
    results,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`
  }
}