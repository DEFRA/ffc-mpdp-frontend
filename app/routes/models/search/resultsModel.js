const config = require('../../../config')
const { getPaymentData } = require('../../../backend/api')
const staticCounties = require('../../../data/filters/counties')
const staticYears = require('../../../data/filters/years')
const { sortByItems } = require('../../../data/sortByItems')
const { getRelatedContentLinks } = require('../../../config/relatedContent')
const { getAllSchemesNames } = require('../../../utils/helper')

const getTags = (query, { counties }) => {
  const tags = {
    Scheme: getAllSchemesNames().reduce((acc, scheme) => {
      if (query.schemes?.toString().toLowerCase().split(',').includes(scheme.toLowerCase())) {
        acc.push({
          text: scheme,
          value: scheme
        })
      }

      return acc
    }, []),
    Year: staticYears.reduce((acc, year) => {
      if (query.years?.includes(year)) {
        acc.push({
          text: `20${year.slice(0, 2)} to 20${year.slice(3, 5)}`,
          value: year
        })
      }

      return acc
    }, []),
    County: getCounties(counties).reduce((acc, county) => {
      if (isChecked(query.counties, county)) {
        acc.push({
          text: county,
          value: county
        })
      }

      return acc
    }, [])
  }

  for (const key in tags) {
    if (tags[key].length === 0) {
      delete tags[key]
    }
  }

  return tags
}

const getFilters = (query, filterOptions) => {
  const schemesLength = !query.schemes ? 0 : (typeof query.schemes === 'string' ? 1 : query.schemes?.length)
  const yearsLength = !query.years ? 0 : (typeof query.years === 'string' ? 1 : query.years?.length)
  const countiesLength = !query.counties ? 0 : (typeof query.counties === 'string' ? 1 : query.counties?.length)
  const attributes = {
    onchange: 'this?.form?.submit()'
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
      items: getCounties(filterOptions.counties).filter((county) => county !== 'None').map((county) => ({
        text: county,
        value: county,
        checked: isChecked(query.counties, county),
        attributes
      })),
      selected: countiesLength
    }
  }
}

const getSchemes = schemes => schemes?.length ? schemes : getAllSchemesNames()

const getYears = years => (years?.length ? years : staticYears)

const getCounties = counties => counties?.length ? counties.sort((a, b) => a.localeCompare(b)) : staticCounties

const isChecked = (field, value) => (typeof field === 'string') ? field?.toLowerCase() === value?.toLowerCase() : field?.find(x => x.toLowerCase() === value.toLowerCase())

const getSortByModel = query => ({
  selected: decodeURIComponent(query.sortBy),
  items: sortByItems
})

const getPaginationAttributes = (totalResults, requestedPage, searchString, filterBy, sortBy) => {
  const encodedSearchString = encodeURIComponent(searchString)
  const totalPages = Math.ceil(totalResults / config.search.limit)

  let prevHref = `/results?searchString=${encodedSearchString}&page=${requestedPage - 1}`
  let nextHref = `/results?searchString=${encodedSearchString}&page=${requestedPage + 1}`
  for (const key in filterBy) {
    if (filterBy[key].length) {
      const urlParam = `&${key}=`
      const urlPart = `${urlParam}${filterBy[key].map(x => encodeURIComponent(x)).join(urlParam)}`
      prevHref += urlPart
      nextHref += urlPart
    }
  }

  if (sortBy) {
    const encodedSortBy = encodeURIComponent(sortBy)
    prevHref += `&sortBy=${encodedSortBy}`
    nextHref += `&sortBy=${encodedSortBy}`
  }

  const previous = requestedPage <= 1
    ? null
    : {
        href: prevHref,
        labelText: `${requestedPage - 1} of ${totalPages} `,
        attributes: {
          id: 'prevOption',
          'aria-label': 'Go to previous page of results: ' + `${requestedPage - 1} of ${totalPages} `
        }
      }

  const next = totalPages <= 1 || totalPages === requestedPage
    ? null
    : {
        href: nextHref,
        labelText: `${requestedPage + 1} of ${totalPages} `,
        attributes: {
          id: 'nextOption',
          'aria-label': 'Go to next page of results: ' + `${requestedPage + 1} of ${totalPages} `
        }
      }

  return { previous, next }
}

const getDownloadResultsLink = (searchString, filterBy, sortBy) => {
  const encodedSearchString = encodeURIComponent(searchString)
  let downloadResultsLink = `/downloadresults?searchString=${encodedSearchString}`
  for (const key in filterBy) {
    if (filterBy[key].length) {
      const urlParam = `&${key}=`
      const urlPart = `${urlParam}${filterBy[key].map(x => encodeURIComponent(x)).join(urlParam)}`
      downloadResultsLink += urlPart
    }
  }
  if (sortBy) {
    const encodedSortBy = encodeURIComponent(sortBy)
    downloadResultsLink += `&sortBy=${encodedSortBy}`
  }

  return { downloadResultsLink }
}

const performSearch = async (searchString, requestedPage, filterBy, sortBy) => {
  const offset = (requestedPage - 1) * config.search.limit
  const paymentData = await getPaymentData(searchString, offset, filterBy, sortBy)
  const results = paymentData.results?.map(({ total_amount, ...x }) => x) // eslint-disable-line camelcase
  return {
    ...paymentData,
    results
  }
}

const resultsModel = async (request, error) => {
  const { query } = request
  const searchString = decodeURIComponent(query.searchString)
  const referer = query.referer || request.headers.referer
  const defaultReturn = {
    hiddenInputs: [
      { id: 'pageId', name: 'pageId', value: 'results' },
      { id: 'sortBy', name: 'sortBy', value: 'score' },
      { id: 'referer', name: 'referer', value: referer }
    ],
    sortBy: getSortByModel(query)
  }

  if (error) {
    return {
      ...defaultReturn,
      relatedContentData: getRelatedContentLinks('search'),
      referer,
      filters: getFilters(query, {
        schemes: getAllSchemesNames(),
        years: staticYears,
        counties: staticCounties
      }),
      tags: getTags(query, {}),
      errorList: [{
        text: 'Enter a name or location',
        href: '#resultsSearchInput'
      }],
      headingTitle: `Results for ‘${searchString}’`,
      total: 0
    }
  }

  const sortBy = decodeURIComponent(query.sortBy)
  const requestedPage = query.page
  const filterBy = {
    schemes: typeof query.schemes === 'string' ? [query.schemes] : query.schemes,
    amounts: typeof query.amounts === 'string' ? [query.amounts] : query.amounts,
    years: typeof query.years === 'string' ? [query.years] : query.years,
    counties: typeof query.counties === 'string' ? [query.counties] : query.counties
  }

  const { results, total, filterOptions } = await performSearch(searchString, requestedPage, filterBy, sortBy)

  return {
    ...defaultReturn,
    searchString,
    ...getPaginationAttributes(total, requestedPage, searchString, filterBy, sortBy),
    filters: getFilters(query, filterOptions),
    tags: getTags(query, filterOptions),
    results,
    total,
    currentPage: requestedPage,
    headingTitle: `${total ? 'Results for' : 'We found no results for'} ‘${searchString}’`,
    ...getDownloadResultsLink(searchString, filterBy, sortBy)
  }
}

module.exports = {
  resultsModel
}
