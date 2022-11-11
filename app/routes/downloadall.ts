import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import config from '../config'

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: (_request: Request, h: ResponseToolkit) => {
    return h.redirect(`${config.backendEndpoint}/downloadall`).permanent(true);
  }
}