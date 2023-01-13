import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = {
  method: 'GET',
  path: '/privacy',
  handler: (request: Request, h: ResponseToolkit): ResponseObject => {
    return h.view('privacy/privacy-policy', { referer: request.headers.referer })
  }
}