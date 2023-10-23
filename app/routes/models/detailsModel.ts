import { getPaymentDetails } from '../../backend/api'
import { getReadableAmount, getSchemeStaticData } from '../../utils/helper'
import { getRelatedContentLinks } from '../../config/relatedContent';
import type { Scheme, Summary, queryParams } from '../../types'

export const detailsModel = async ({ payeeName, partPostcode, searchString, page } : queryParams) => {
  const paymentDetails = await getPaymentDetails(payeeName, partPostcode)

  if(!paymentDetails) {
    return {
      searchString: searchString,
      page: page
    }
  }

  return {
    relatedContentData: getRelatedContentLinks('details'),
		summary: createPaymentDetailsSummary(paymentDetails),
    searchString: searchString,
    page: page
	}
}

const createPaymentDetailsSummary = (paymentDetails: any) => {
  const summary = createSummary(paymentDetails)

  let farmerTotal = 0
  paymentDetails.schemes.forEach((scheme: any) => {
    const amount = parseFloat(scheme.amount)
    farmerTotal += amount

    addSchemeToSummary(summary, scheme)
    
    if(!summary.financial_years.includes(scheme.financial_year)) {
      summary.financial_years.push(scheme.financial_year)
    }
  })

  summary.total = getReadableAmount(farmerTotal)
  summary.financial_years.sort((a, b) => {
    const [_startYearA, endYearA] = a.split('/')
    const [_startYearB, endYearB] = b.split('/')
    return parseInt(endYearA) - parseInt(endYearB)
  })
  summary.startYear = `20${summary.financial_years[0].split('/')[0]}`
  summary.endYear = `20${summary.financial_years[summary.financial_years.length - 1].split('/')[1]}`
  return summary
}

const createSummary = (paymentDetails: any) => {
  const { payee_name, part_postcode, town, county_council, parliamentary_constituency } = paymentDetails
  
  return { 
    payee_name, 
    part_postcode, 
    town, 
    county_council,
    parliamentary_constituency,
    total: '',
    schemes: [] as Scheme[],
    financial_years: []
  } as Summary
}

const addSchemeToSummary = (summary: Summary, scheme: any) => {
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
  }
  else {
    schemeData.total += amount
    schemeData.readableTotal = getReadableAmount(schemeData.total)
  }
  
  addSchemeActivity(scheme, schemeData)
}

const addSchemeActivity = (scheme: any, schemeData: Scheme) => {
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
