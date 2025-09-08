const Joi = require('joi')
const { detailsModel } = require('./models/details')
const { getRelatedContentLinks } = require('../config/related-content')

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
          return h.view(
            'search/index',
            {
              ...request.query,
              errorList: [
                {
                  text: 'Enter a name or location',
                  href: '#searchInput'
                }
              ],
              pageTitle: 'Search for an agreement holder',
              relatedContentData: getRelatedContentLinks('details')
            }
          ).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        request.query.searchString = encodeURIComponent(request.query.searchString)
        return h.view('details/index', await detailsModel(request.query))
      }
    }
  }
]
