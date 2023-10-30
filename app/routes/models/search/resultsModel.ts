import config from '../../../config'
import { getPaymentData } from '../../../backend/api'
import { counties as staticCounties } from '../../../data/filters/counties'
import { years as staticYears } from '../../../data/filters/years';
import { sortByItems } from '../../../data/sortByItems'
import { getRelatedContentLinks } from '../../../config/relatedContent';
import { getAllSchemesNames } from '../../../utils/helper'

const getTags = (query: any) => {
  const tags = {
    Scheme: getAllSchemesNames().reduce((acc, scheme) => {
      if(query.schemes?.toString().toLowerCase().split(',').includes(scheme.toLowerCase())) {
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
    Year: staticYears.reduce((acc, year) => {
      if(query.years?.includes(year)) {
        acc.push({
          text: `20${year.slice(0, 2)} to 20${year.slice(3, 5)}`,
          value: year
        })
      }
      
      return acc
    }, new Array<{
        text: string, 
        value: string
    }>),
    County: staticCounties.reduce((acc, county) => {
      if(query.counties?.toString().toLowerCase().split(',').includes(county.toLowerCase())) {
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

const getFilters = (query: any, filterOptions: { schemes: string[], years: string[], counties: string[] }) => {
  const schemesLength = !query.schemes? 0 : (typeof query.schemes === 'string'? 1: query.schemes?.length)
  const yearsLength = !query.years? 0 : (typeof query.years === 'string'? 1: query.years?.length)
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
    years: {
      name: 'Year',
      items: getYears(filterOptions.years).map(year => ({ 
        text: `20${year.slice(0, 2)} to 20${year.slice(3, 5)}`, 
        value: year,
        checked: isChecked(query.years, year),
        attributes
      })),
      selected: yearsLength
    },
    counties: {
      name: 'County',
      items: getCounties(filterOptions.counties).filter((county) => county != 'None').map((county) => ({
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

const getYears = (years: string[]) => (years?.length ? years : staticYears);

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

const getDownloadResultsLink = (searchString: string, filterBy: any, sortBy: string) => {
  const encodedSearchString = encodeURIComponent(searchString)
  let downloadResultsLink = `/downloadresults?searchString=${encodedSearchString}`
  for(let key in filterBy) {
    if(filterBy[key].length) {
      const urlParam = `&${key}=`
      const urlPart = `${urlParam}${filterBy[key].join(urlParam)}`
      downloadResultsLink += urlPart
    }
  }
  if(sortBy) {
    const encodedSortBy = encodeURIComponent(sortBy)
    downloadResultsLink += `&sortBy=${encodedSortBy}`
  }
  return {downloadResultsLink}
}

const performSearch = async (searchString: string, requestedPage: number, filterBy: any, sortBy: string) => {
  const offset = (requestedPage - 1) * config.search.limit
  const paymentData = await getPaymentData(searchString, offset, filterBy, sortBy)
  const results = paymentData.results?.map(({total_amount, ...x}: any) => x)
  return {
    ...paymentData,
    results
  }
}

export const resultsModel = async (query: any, error?: any) => {
  const searchString = decodeURIComponent(query.searchString)
  const defaultReturn = {
    relatedContentData: getRelatedContentLinks('results'),
    hiddenInputs: [
      { id: 'pageId', name: 'pageId', value: 'results' },
      { id: 'sortBy', name: 'sortBy', value: 'score' },
    ],
    tags: getTags(query),
    sortBy: getSortByModel(query),
  };
  
  if(error) {
    return {
      ...defaultReturn,
      filters: getFilters(query, {
        schemes: getAllSchemesNames(),
        years: staticYears,
        counties: staticCounties
      }),
      errorList: [{
        text: "Enter a name or location",
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
    years: typeof query.years === 'string' ? [query.years]: query.years,
    counties: typeof query.counties === 'string' ? [query.counties]: query.counties
  }

  const { results, total, filterOptions } = await performSearch(searchString, requestedPage, filterBy, sortBy)
  
  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, filterBy, sortBy),
    filters: getFilters(query, filterOptions),
    results,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`,
    ...getDownloadResultsLink(searchString, filterBy, sortBy)
  }
}