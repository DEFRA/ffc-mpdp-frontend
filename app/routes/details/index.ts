import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import { getPaymentDetails } from '../../backend/api'
import { getReadableAmount, getSchemeStaticData } from '../../utils/helper'

type queryParams = {
  payeeName: string, 
  searchString: string, 
  page: string 
}

type Summary = {
  payee_name: string,
  part_postcode: string,
  town: string,
  county_council: string,
  parliamentary_constituency: string,
  financial_year: string,
  total: string,
  startYear?: string,
  endYear?: string,
  schemes: [{
    name: string,
    description: string,
    link: string,
    total?: string,
    schemeTypes: [{
      name: string,
      amount?: string,
      activityLevel: string
    }]
  }] | any[]
}

const createModel = ({ payeeName, searchString, page } : queryParams) => {
	const farmerDetails = getPaymentDetails(payeeName)
  
  if(!farmerDetails) {
    return {
      searchString: searchString,
      page: page
    }
  }

  const { payee_name, part_postcode, town, county_council, parliamentary_constituency, financial_year } = farmerDetails
  const [startYear, endYear] = farmerDetails.financial_year.split('/')
  const summary: Summary = { 
    payee_name, 
    part_postcode, 
    town, 
    county_council,
    parliamentary_constituency,
    financial_year, 
    total: '',
    schemes: [],
    startYear: `20${startYear}`,
    endYear: `20${endYear}`
  }
  
  let farmerTotal = 0
  let schemeTotal = 0
  farmerDetails.schemes.forEach((scheme) => {
    const amount = parseFloat(scheme.amount)
    
    farmerTotal += amount
    schemeTotal += amount

    const schemeDetails = {
      name: scheme.scheme_detail,
      activityLevel: scheme.activity_detail,
      amount: getReadableAmount(amount),
    }

    const index = summary.schemes?.findIndex(x => x?.name === scheme.scheme)
    if(index === -1) {
      const schemeData = getSchemeStaticData(scheme.scheme)
      schemeTotal = amount;
      summary.schemes.push({
        name: scheme.scheme,
        description: schemeData?.description || '',
        link: schemeData?.link || '',
        total: getReadableAmount(schemeTotal),
        schemeTypes: [schemeDetails]
      })
    }
    else {
      summary.schemes[index].total = getReadableAmount(schemeTotal)
      summary.schemes[index].schemeTypes.push(schemeDetails)
    }
  })

  summary.total = getReadableAmount(farmerTotal)

  return {
		summary,
    searchString: searchString,
    page: page
	}
}

module.exports = [
  {
    path: '/details',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
					payeeName: Joi.string().strict().trim().min(1).required(),
          searchString: Joi.string().strict().trim().min(1).required(),
          page: Joi.number().default(1),
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: (request: Request, h: ResponseToolkit): ResponseObject => {
        return h.view('details/index', createModel(request.query as queryParams))
      }
    }
  }
]
