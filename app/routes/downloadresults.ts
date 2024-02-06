import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { getPaymentData } from "../backend/api";
import { getReadableAmount } from '../utils/helper'
const { Parser } = require('json2csv')

module.exports = [
  {
    path: '/downloadresults',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          searchString: Joi.string().trim().min(1).required(),
          page: Joi.number().default(1),
          pageId: Joi.string().default(''),
          schemes: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          amounts: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          years: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          counties: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          sortBy: Joi.string().trim().optional().default('score'),
        }),
        failAction: async (_request: Request, h: ResponseToolkit, error: any) => {
          h.response(error.toString()).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit) => {
        const csvFields =  [
          'payee_name',
          'part_postcode',
          'town',
          'county_council',
          'amount'
        ]
        const action = 'download'
        const offset = 0
        const limit = -1
        const { searchString, schemes, amounts,  counties } = request.query
        const sortBy = decodeURIComponent(request.query.sortBy)
        const filterBy = {
          schemes: typeof schemes === 'string' ? [schemes]: schemes,
          amounts: typeof amounts === 'string' ? [amounts]: amounts,
          counties: typeof counties === 'string' ? [counties]: counties
        }
        const { results } = await getPaymentData(searchString, offset, filterBy, sortBy, action,limit)
        const matches = results.map((x: any) => ({...x, amount: getReadableAmount(parseFloat(x.total_amount))}))
        const csvParser = new Parser({ fields: csvFields })
        const csv = csvParser.parse(matches)
        return h.response(csv)
            .type('application/csv')
            .header('Content-Disposition', 'attachment; filename=\"ffc-payment-results.csv\"')
      }
    }
  }
]
