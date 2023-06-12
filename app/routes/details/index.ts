import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import { detailsModel } from "../models/detailsModel";

import type { queryParams } from '../../types'

module.exports = [
  {
    path: '/details',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
					payeeName: Joi.string().trim().min(1).required(),
          partPostcode: Joi.string().trim().min(1).required(),
          searchString: Joi.string().trim().min(1).required(),
          page: Joi.number().default(1),
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        request.query.searchString=encodeURIComponent(request.query.searchString)
        return h.view('details/index', await detailsModel(request.query as queryParams))
      }
    }
  }
]
