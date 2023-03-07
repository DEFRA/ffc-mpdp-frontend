import config from '../../config'
import { getPaymentData } from '../../backend/api'
import { amounts } from '../../data/filters/amounts'
import { counties } from '../../data/filters/counties'
import { sortByItems } from '../../data/sortByItems'

import { getReadableAmount, getAllSchemesNames } from '../../utils/helper'

const getTags = (query: any) => {
  return {
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
    Amount: amounts.reduce((acc, amount) => {
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
    County: counties.reduce((acc, county) => {
      if((typeof query.counties === 'string')? query.counties === county : query.counties?.includes(county)) {
        acc.push({
					text: county,
					value: county
				})
      }

      return acc
    },  new Array<{
			text: string, 
			value: string
	}>)
  }
}

const getFilters = (query: any) => {
  const schemesLength = !query.schemes? 0 : (typeof query.schemes === 'string'? 1: query.schemes?.length)
  const amountsLength = !query.amounts? 0 : (typeof query.amounts === 'string'? 1: query.amounts?.length)
  const countiesLength = !query.counties? 0 : (typeof query.counties === 'string'? 1: query.counties?.length)
  const attributes = {
    onchange: "this.form.submit()"
  }

  return {
    schemes: getAllSchemesNames().map(x => ({ 
      text: x, 
      value: x,
      checked: query.schemes?.includes(x),
      attributes
    })),
    amounts: amounts.map(({text, value}) => ({
      text,
      value,
      checked: (typeof query.amounts === 'string')? query.amounts === value : query.amounts?.includes(value),
      attributes
    })),
    counties: counties.map((county) => ({
      text: county,
      value: county,
      checked: (typeof query.counties === 'string')? query.counties === county : query.counties?.includes(county),
      attributes
    })),
    selected: {
      schemesLength,
      amountsLength,
      countiesLength
    }
  }
}

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
  const { results, total } = await getPaymentData(searchString, offset, filterBy, sortBy)

  const matches = results.map((x: any) => ({...x, amount: getReadableAmount(parseFloat(x.total_amount))}))
  return {
    matches,
    total: total
  }
}

export const createModel = async (query: any, error?: any) => {
  const searchString = decodeURIComponent(query.searchString)
  const defaultReturn = {
    hiddenInputs: [
      { id: 'pageId', name: 'pageId', value: 'results' },
      { id: 'sortBy', name: 'sortBy', value: 'score' }
    ],
    filters: getFilters(query),
    tags: getTags(query),
    sortBy: getSortByModel(query)
  }
  
  if(error) {
    return {
      ...defaultReturn,
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

  const { matches, total } = await performSearch(searchString, requestedPage, filterBy, sortBy)
  
  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, filterBy, sortBy),
    results: matches,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`
  }
}