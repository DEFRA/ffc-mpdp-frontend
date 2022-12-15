import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from 'joi'

import { updatePolicy } from '../../cookies'
import { cookieModel } from "../models/cookieModel"
import config from '../../config'

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request: Request, h: ResponseToolkit): ResponseObject => {
    return h.view('cookies/cookie-policy', cookieModel(request.state[config.cookie.cookieNameCookiePolicy], request.query.updated))
  },
},
{
  method: 'POST',
  path: '/cookies',
  options: {
    auth: false,
    plugins: {
      crumb: false
    },
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: (request: Request, h: ResponseToolkit) => {
      updatePolicy(request, h, (request.payload as any).analytics)
      if ((request.payload as any).async) {
        return h.response('ok')
      }
      return h.redirect('/cookies?updated=true')
    }
  }
}]