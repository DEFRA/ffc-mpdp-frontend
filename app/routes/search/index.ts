import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = [
  {
    path: '/search',
    method: 'GET',
    options: {
      auth: false,
      handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
        return h.view('search/index')
      }
    }
  }
]
