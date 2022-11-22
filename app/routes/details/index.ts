import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import { getPaymentDetails } from '../../backend/api'
import { getReadableAmount } from '../../utils/helper'

type queryParams = {
  payeeName: string, 
  searchString: string, 
  page: string 
}

const createModel = ({ payeeName, searchString, page } : queryParams) => {
	const details = getPaymentDetails(payeeName)
  
  if(details) {
    let total = 0;
    details.schemes.forEach(scheme => { 
      total += parseInt(scheme.amount)
      scheme.amount = getReadableAmount(parseInt(scheme.amount))
    });

    const [startYear, endYear] = details.financial_year.split('/')
    Object.assign(details, { 
      total: getReadableAmount(total),
      startYear, 
      endYear 
    })
  }
  
  return {
		details,
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
