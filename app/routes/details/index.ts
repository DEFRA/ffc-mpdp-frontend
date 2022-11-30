import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import { getPaymentDetails } from '../../backend/api'
import { getReadableAmount, getSchemeStaticData } from '../../utils/helper'
import type { Scheme, SchemeDetail, queryParams } from '../../types'

const getSchemLevel = (level: string) => {
  if(!level || level.toLowerCase() === 'n/a') return null

  return level
}

const createModel = async ({ payeeName, partPostcode, searchString, page } : queryParams) => {
	const farmerDetails = await getPaymentDetails(payeeName, partPostcode)

  if(!farmerDetails) {
    return {
      searchString: searchString,
      page: page
    }
  }

  const { payee_name, part_postcode, town, county_council, parliamentary_constituency, financial_year } = farmerDetails
  const [startYear, endYear] = farmerDetails.financial_year.split('/')
  const summary = { 
    payee_name, 
    part_postcode, 
    town, 
    county_council,
    parliamentary_constituency,
    financial_year, 
    total: '',
    schemes: [] as Scheme[],
    startYear: `20${startYear}`,
    endYear: `20${endYear}`
  }
  
  let farmerTotal = 0
  let schemeTotal = 0
  farmerDetails.schemes.forEach((scheme) => {
    const amount = parseFloat(scheme.amount)
    
    farmerTotal += amount
    schemeTotal += amount

    const schemeDetails: SchemeDetail = {
      name: scheme.scheme_detail,
      activityLevel: getSchemLevel(scheme.activity_level),
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
          partPostcode: Joi.string().min(1).required(),
          searchString: Joi.string().strict().trim().min(1).required(),
          page: Joi.number().default(1),
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        return h.view('details/index', await createModel(request.query as queryParams))
      }
    }
  }
]
