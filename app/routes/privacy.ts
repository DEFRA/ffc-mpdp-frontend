import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { getRelatedContentLinks } from '../config/relatedContent';

module.exports = {
  method: 'GET',
  path: '/privacy',
  handler: (request: Request, h: ResponseToolkit): ResponseObject => {
    return h.view('privacy/privacy-policy', {
      referer: request.headers.referer,
      relatedContentData: getRelatedContentLinks('privacy-policy'),
    });
  }
}