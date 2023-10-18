import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { getRelatedContentLinks } from '../../config/relatedContent';

module.exports = [
  {
    path: '/search',
    method: 'GET',
    options: {
      auth: false,
      handler: (request: Request, h: ResponseToolkit): ResponseObject => {
        return h.view('search/index', {
          referer: request.headers.referer,
          relatedContentData: getRelatedContentLinks('search'),
        });
      }
    }
  }
]
