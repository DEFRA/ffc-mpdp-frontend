const api = require('../../backend/api')
const { getReadableAmount, getSchemeStaticData } = require('../../utils/helper')
const { getRelatedContentLinks } = require('../../config/related-content')

async function detailsModel ({ payeeName, partPostcode, searchString, page }) {
  const paymentDetails = await api.getPaymentDetails(payeeName, partPostcode)

  if (!paymentDetails) {
    return {
      searchString,
      page
    }
  }

  return {
    relatedContentData: getRelatedContentLinks('details'),
    summary: createPaymentDetailsSummary(paymentDetails),
    searchString,
    page
  }
}

function createPaymentDetailsSummary (paymentDetails) {
  const summary = createSummary(paymentDetails)

  let farmerTotal = 0

  if (paymentDetails.schemes) {
    paymentDetails.schemes.forEach(scheme => {
      const amount = parseFloat(scheme.amount)
      farmerTotal += amount

      addSchemeToSummary(summary, scheme)

      if (!summary.financial_years.includes(scheme.financial_year)) {
        summary.financial_years.push(scheme.financial_year)
      }
    })
  }

  summary.total = getReadableAmount(farmerTotal)
  summary.financial_years.sort((a, b) => {
    const [_startYearA, endYearA] = a.split('/') // eslint-disable-line no-unused-vars
    const [_startYearB, endYearB] = b.split('/') // eslint-disable-line no-unused-vars
    return parseInt(endYearA) - parseInt(endYearB)
  })
  summary.startYear = `20${summary.financial_years[0].split('/')[0]}`
  summary.endYear = `20${summary.financial_years[summary.financial_years.length - 1].split('/')[1]}`
  summary.downloadLink = `/downloaddetails?payeeName=${encodeURIComponent(summary.payee_name)}&partPostcode=${summary.part_postcode}`
  return summary
}

function createSummary (paymentDetails) {
  /* eslint-disable camelcase */
  const { payee_name, part_postcode, town, county_council, parliamentary_constituency } = paymentDetails

  return {
    payee_name,
    part_postcode,
    town,
    county_council,
    parliamentary_constituency,
    total: '',
    schemes: [],
    financial_years: [],
    downloadLink: ''
  }
  /* eslint-enable camelcase */
}

function addSchemeToSummary (summary, scheme) {
  const amount = parseFloat(scheme.amount)
  let schemeData = summary.schemes.find(x => x?.name.toLowerCase() === scheme.name.toLowerCase())
  if (!schemeData) {
    const staticSchemeData = getSchemeStaticData(scheme.name)
    schemeData = {
      name: scheme.name,
      description: staticSchemeData?.description || '',
      link: staticSchemeData?.link || '',
      total: amount,
      readableTotal: getReadableAmount(amount),
      activity: {}
    }
    summary.schemes.push(schemeData)
  } else {
    schemeData.total += amount
    schemeData.readableTotal = getReadableAmount(schemeData.total)
  }

  addSchemeActivity(scheme, schemeData)
}

function addSchemeActivity (scheme, schemeData) {
  const [startYear, endYear] = scheme.financial_year.split('/')
  const financialYear = `20${startYear} to 20${endYear}`
  if (!(financialYear in schemeData?.activity)) {
    schemeData.activity[financialYear] = {
      total: 0,
      readableTotal: '',
      schemeDetails: []
    }
  }

  const schemeAmount = parseFloat(scheme.amount)
  schemeData.activity[financialYear].total += schemeAmount
  schemeData.activity[financialYear].readableTotal = getReadableAmount(schemeData.activity[financialYear].total)
  schemeData.activity[financialYear].schemeDetails.push({
    name: scheme.detail,
    amount: getReadableAmount(schemeAmount)
  })
}

module.exports = {
  detailsModel
}
