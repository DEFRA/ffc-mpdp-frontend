import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = [{
  path: '/feedback',
  method: 'GET',
  options: {
    auth: false,
    handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
      return h.view('feedback/index')
    }
  }
}]
