import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { resultsModel } from "../models/search/resultsModel";
import { resultsQuery as query } from "../queries/search/results";

module.exports = [
  {
    path: '/results',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query,
        failAction: async (request: Request, h: ResponseToolkit, error: any) => {
          if(!(request.query as any).searchString.trim()) {
            return h.view(
              `search/${(request.query as any).pageId || 'index'}`,
              await resultsModel(request, error)
            ).code(400).takeover()
          }

          return h.view('search/index', { ...(request.query as Object), errorList: [{ text: error.details[0].message }]}).code(400).takeover()
        }
      },
      handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        request.query.searchString=encodeURIComponent(request.query.searchString)
        return h.view('search/results', await resultsModel(request));
      }  
    }
  }
]
