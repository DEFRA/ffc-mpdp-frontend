import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = {
  method: 'GET',
  path: '/cookies',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.view('cookies/cookie-policy')
  }
}