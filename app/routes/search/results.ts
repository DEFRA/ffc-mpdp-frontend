import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

import { createModel } from "../models/searchResultsModel";

module.exports = [
  {
    path: '/results',
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
          sortBy: Joi.string().trim().optional().default('score')
        }),
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          if(!(request.query as any).searchString.trim()) {
            return h.view(
              `search/${(request.query as any).pageId || 'index'}`,
              await createModel(request.query, error)
            ).code(400).takeover()
          }
        
          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }]}).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        return h.view('search/results', await createModel(request.query))
      }
    }
  }
]
