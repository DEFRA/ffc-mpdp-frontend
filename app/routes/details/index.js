const { detailsModel } = require('../models/detailsModel')
const Joi = require('joi')

module.exports = [
  {
    path: '/details',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          payeeName: Joi.string().trim().min(1).required(),
          partPostcode: Joi.string().trim().min(1).required(),
          searchString: Joi.string().trim().min(1).required(),
          page: Joi.number().default(1)
        }),
        failAction: async (request, h, error) => {
          return h.view('search/index', { ...request.query, errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        request.query.searchString = encodeURIComponent(request.query.searchString)
        return h.view('details/index', await detailsModel(request.query))
      }
    }
  }
]
