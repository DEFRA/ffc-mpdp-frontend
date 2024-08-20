const wreck = require('@hapi/wreck')
const config = require('../config')
const { getUrlParams } = require('../utils/helper')

const get = async url => {
  try {
    return (await wreck.get(`${config.backendEndpoint}${url}`))
  } catch (err) {
    console.error(`Encountered error while calling the backend with url: ${config.backendEndpoint}${url}}`, err)
    return null
  }
}

const post = async (url, payload) => {
  try {
    return (await wreck.post(`${config.backendEndpoint}${url}`, { payload }))
  } catch (err) {
    console.error(`Encountered error while calling the backend with url: ${url}`, err)
    return null
  }
}

const getPaymentData = async (
  searchString,
  offset,
  filterBy,
  sortBy,
  action,
  limit = config.search.limit) => {
  const response = await post('/paymentdata', {
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

const getSearchSuggestions = async searchString => {
  const url = getUrlParams('searchsuggestion', {
    searchString
  })

  const response = await get(url)
  if (!response) {
    return { rows: [], count: 0 }
  }

  return JSON.parse(response.payload)
}

const getPaymentDetails = async (payeeName, partPostcode) => {
  const url = getUrlParams('paymentdetails', {
    payeeName,
    partPostcode
  })

  const response = await get(url)
  if (!response) {
    return null
  }

  return JSON.parse(response.payload)
}

const getDownloadDetailsCsv = async (payeeName, partPostcode) => {
  const url = getUrlParams('downloaddetails', {
    payeeName,
    partPostcode
  })
  return getBufferFromUrl(url)
}

const getBufferFromUrl = async url => {
  try {
    const response = await fetch(`${config.backendEndpoint}${url}`)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.log('Error while reading from URL ' + url, error)
    throw error
  }
}

const getSchemePaymentsByYear = async () => {
  const url = getUrlParams('schemePayments')

  const response = await get(url)
  if (!response) {
    return null
  }

  return JSON.parse(response.payload)
}

module.exports = {
  get,
  post,
  getPaymentData,
  getSearchSuggestions,
  getPaymentDetails,
  getDownloadDetailsCsv,
  getSchemePaymentsByYear
}
