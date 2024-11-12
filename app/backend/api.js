const wreck = require('@hapi/wreck')
const config = require('../config')

async function get (url) {
  try {
    return (await wreck.get(`${config.backendEndpoint}${config.backendPath}${url}`))
  } catch (err) {
    console.error(`Encountered error while calling the backend with url: ${config.backendEndpoint}${url}}`, err)
    return null
  }
}

async function post (url, payload) {
  try {
    return (await wreck.post(`${config.backendEndpoint}${config.backendPath}${url}`, { payload }))
  } catch (err) {
    console.error(`Encountered error while calling the backend with url: ${url}`, err)
    return null
  }
}

async function getPaymentData (
  searchString,
  offset,
  filterBy,
  sortBy,
  action,
  limit = config.search.limit) {
  const response = await post('', {
    searchString,
    limit,
    offset,
    filterBy,
    sortBy,
    action
  })

  if (!response) {
    return { results: [], total: 0, filterOptions: { schemes: [], years: [], counties: [] } }
  }

  const result = JSON.parse(response.payload)
  return {
    results: result.rows,
    total: result.count,
    filterOptions: result.filterOptions
  }
}

async function getSearchSuggestions (searchString) {
  const url = getUrlParams('search', {
    searchString
  })

  const response = await get(url)
  if (!response) {
    return { rows: [], count: 0 }
  }

  return JSON.parse(response.payload)
}

async function getPaymentDetails (payeeName, partPostcode) {
  const url = getUrlParams(`${payeeName}/${partPostcode}`)

  const response = await get(url)
  if (!response) {
    return null
  }

  return JSON.parse(response.payload)
}

async function getDownloadDetailsCsv (payeeName, partPostcode) {
  const url = getUrlParams(`${payeeName}/${partPostcode}`)
  return getBufferFromUrl(url)
}

async function getBufferFromUrl (url) {
  try {
    const response = await fetch(`${config.backendEndpoint}${config.backendPath}${url}`)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.log('Error while reading from URL ' + url, error)
    throw error
  }
}

async function getSchemePaymentsByYear () {
  const url = getUrlParams('summary')

  const response = await get(url)
  if (!response) {
    return null
  }

  return JSON.parse(response.payload)
}

function getUrlParams (page, params = {}) {
  if (Object.keys(params).length === 0) {
    return `/${page}`
  }
  return `/${page}?${new URLSearchParams(params).toString()}`
}

module.exports = {
  get,
  post,
  getPaymentData,
  getSearchSuggestions,
  getPaymentDetails,
  getDownloadDetailsCsv,
  getSchemePaymentsByYear,
  getUrlParams
}
