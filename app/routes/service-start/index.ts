import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { getRelatedContentLinks } from '../../config/relatedContent';

const sharedConfig = {
  method: 'GET',
  options: {
    auth: false,
    handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
      return h.view('service-start/index', {
        relatedContentData: getRelatedContentLinks('service-start'),
      });
    }
  }
}

module.exports = [{
  path: '/service-start',
  ...sharedConfig
}, {
  path: '/',
  ...sharedConfig
}
]
