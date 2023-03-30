import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";
import { getSearchSuggestions } from "../../backend/api";

module.exports = [
  {
    path: '/suggestions',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          searchString: Joi.string().regex(/^[a-zA-Z0-9 ']*$/).trim().min(1).required(),
        }),
        failAction: async (_request: Request, h: ResponseToolkit, error: any) => {
          return h.response(error.toString()).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        const searchString = decodeURIComponent(request.query.searchString)
        return h.response(await getSearchSuggestions(searchString))
      }
    }
  }
]
