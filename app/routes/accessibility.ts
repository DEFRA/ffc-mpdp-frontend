import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = {
  method: 'GET',
  path: '/accessibility',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.view('accessibility/accessibility-policy', {
      referer: _request.headers.referer,
      // relatedContentData: getRelatedContentLinks('accessibility-policy'),
    });
  }
}