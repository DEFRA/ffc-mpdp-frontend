const { getSchemePaymentsByYear } = require('../../backend/api')
const { getRelatedContentLinks } = require('../../config/related-content')
const { getFinancialYearSummary, getReadableAmount } = require('../../utils/helper')

async function schemePaymentsByYearModel () {
  const schemePaymentsByYear = await getSchemePaymentsByYear()

  if (!schemePaymentsByYear) {
    throw new Error()
  }

  const returnVal = {
    relatedContentData: getRelatedContentLinks('scheme-payments-by-year'),
    summary: {
      ...getFinancialYearSummary(Object.keys(schemePaymentsByYear)),
      ...getSchemeSummary(schemePaymentsByYear),
      schemePaymentsByYear: transformSummary(schemePaymentsByYear)
    }
  }

  return returnVal
}

function getSchemeSummary (schemePaymentsByYear) {
  let total = 0
  const totalPaymentsBySchemes = []
  const totalPaymentsByYear = {}

  Object.keys(schemePaymentsByYear).forEach(year => {
    const formattedYear = getFormattedYear(year)
    totalPaymentsByYear[formattedYear] = { total: 0 }

    /* eslint-disable camelcase */
    schemePaymentsByYear[year].forEach(({ scheme, total_amount }) => {
      const schemeData = totalPaymentsBySchemes.find(x => x?.name === scheme)
      const schemeAmount = parseInt(total_amount)

      if (!schemeData) {
        totalPaymentsBySchemes.push({
          name: scheme,
          total: schemeAmount,
          readableTotal: getReadableAmount(schemeAmount)
        })
      } else {
        schemeData.total += schemeAmount
        schemeData.readableTotal = getReadableAmount(schemeData.total)
      }

      total += schemeAmount
      totalPaymentsByYear[formattedYear].total += schemeAmount
    })
    /* eslint-enable camelcase */

    totalPaymentsByYear[formattedYear].readableTotal = getReadableAmount(totalPaymentsByYear[formattedYear].total)
  })

  return {
    totalPaymentsBySchemes,
    totalPaymentsByYear,
    readableTotalAmount: getReadableAmount(total)
  }
}

function getFormattedYear (year) {
  return year.split('/').map(x => `20${x}`).join(' to ')
}

function transformSummary (schemePaymentsByYear) {
  const schemePaymentsSummary = {}
  Object.keys(schemePaymentsByYear).forEach(year => {
    const formattedYear = getFormattedYear(year)
    schemePaymentsSummary[formattedYear] = schemePaymentsByYear[year].map(scheme => ({
      ...scheme, total_amount: getReadableAmount(parseInt(scheme.total_amount))
    }))
  })
  return schemePaymentsSummary
}

module.exports = {
  schemePaymentsByYearModel
}
