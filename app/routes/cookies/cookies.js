const Joi = require('joi')

const { updatePolicy } = require('../../cookies')
const { cookieModel } = require('../models/cookie')
const config = require('../../config')

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) =>
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
    handler: (request, h) => {
      const payload = request.payload
      updatePolicy(request, h, payload.analytics)
      if (payload.async) {
        return h.response('ok')
      }

      return h.view('cookies/cookie-policy', cookieModel(request.state[config.cookie.cookieNameCookiePolicy], true, payload.referer))
    }
  }
}]
