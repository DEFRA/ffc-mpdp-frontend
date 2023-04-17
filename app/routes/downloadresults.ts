import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";
import { getDownloadDetailsCsv } from "../backend/api";
import { createModel } from "./models/searchResultsModel";
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
          counties: Joi.alternatives().try(Joi.string(), Joi.array()).default([]),
          sortBy: Joi.string().trim().optional().default('score'),
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
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
        request.query.action = 'download'
        const model = await createModel(request.query)
        const csvParser = new Parser({ fields: csvFields })
        const csv = csvParser.parse(model.results)
        return h.response(csv)
            .type('application/csv')
            .header('Content-Disposition', 'attachment; filename=\"ffc-payment-results.csv\"')
      }
    }
  }
]
