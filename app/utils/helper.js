const config = require('../config')
const { schemeStaticData } = require('../data/schemeStaticData')
const staticAmounts = require('../data/filters/amounts')
const path = require('path')

const getReadableAmount = amount => {
  if (typeof amount !== 'number') {
    return '0'
  }

  return amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getSchemeStaticData = schemeName => schemeStaticData.find(x => x.name.toLowerCase() === schemeName.toLowerCase())

const getAllSchemesNames = () => schemeStaticData.map(x => x.name)

const getUrlParams = (page, params = {}) => `/${page}?${new URLSearchParams(params).toString()}`

const getPageTitle = route => config.routes[route]?.title || ''

const removeTrailingSlash = url => url.replace(/\/$/, '')

const getMatchingStaticAmounts = amounts => {
  if (!amounts || !amounts.length) return []

  const _amounts = amounts?.map(x => parseFloat(x))

  const returnAmounts = staticAmounts.filter(range => {
    const [from, to] = range.value.split('-')
    return _amounts?.some(amount => {
      if (!to) {
        return amount > parseFloat(from)
      }

      return amount >= parseFloat(from) && amount <= parseFloat(to)
    })
  })

  return returnAmounts
}

const getFinancialYearSummary = financialYears => {
  /* eslint-disable camelcase */
  const financial_years = sortFinancialYears(financialYears)
  if (!financial_years || financial_years.length === 0) return

  return {
    financial_years,
    startYear: `20${financial_years[0].split('/')[0]}`,
    endYear: `20${financial_years[financial_years.length - 1].split('/')[1]}`
  }
  /* eslint-enable camelcase */
}

const sortFinancialYears = financialYears => {
  return financialYears.sort((a, b) => {
    const [_startYearA, endYearA] = a.split('/') // eslint-disable-line no-unused-vars
    const [_startYearB, endYearB] = b.split('/') // eslint-disable-line no-unused-vars
    return parseInt(endYearA) - parseInt(endYearB)
  })
}

const getAllPaymentDataFilePath = () => {
  return path.join(__dirname, '..', 'data', 'downloads', 'ffc-payment-data.csv')
}

module.exports = {
  getReadableAmount,
  getSchemeStaticData,
  getAllSchemesNames,
  getUrlParams,
  getPageTitle,
  removeTrailingSlash,
  getMatchingStaticAmounts,
  getFinancialYearSummary,
  getAllPaymentDataFilePath
}
