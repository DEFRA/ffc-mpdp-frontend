const Joi = require('joi')
const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        path: Joi.string().required()
      }),
      failAction: (request, h, err) => {
        throw Boom.notFound()
      }
    },
    handler: {
      directory: {
        path: [
          'app/dist',
          'node_modules/govuk-frontend/dist/govuk/assets'
        ]
      }
    },
    cache: {
      privacy: 'private'
    },
    state: {
      parse: false,
      failAction: 'ignore'
    }
  }
}
