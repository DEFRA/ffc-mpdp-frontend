import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from 'joi'

import { updatePolicy } from '../../cookies'
import { cookieModel } from "../models/cookieModel"
import config from '../../config'

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request: Request, h: ResponseToolkit): ResponseObject => 
    h.view('cookies/cookie-policy', cookieModel(request.state[config.cookie.cookieNameCookiePolicy], false, request.headers.referer))
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
        async: Joi.boolean().default(false),
        referer: Joi.string().optional()
      })
    },
    handler: (request: Request, h: ResponseToolkit) => {
      const payload: any = request.payload
      updatePolicy(request, h, payload.analytics)
      if (payload.async) {
        return h.response('ok')
      }
      
      return h.view('cookies/cookie-policy', cookieModel(request.state[config.cookie.cookieNameCookiePolicy], true, payload.referer))
    }
  }
}]