const Joi = require('joi')
const { getSearchSuggestions } = require('../../backend/api')

module.exports = [
  {
    path: '/suggestions',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          searchString: Joi.string().trim().min(3).required()
        }),
        failAction: async (_request, h, error) => {
          return h.response(error.toString()).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        return h.response(await getSearchSuggestions(request.query.searchString))
      }
    }
  }
]
