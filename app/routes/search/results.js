const { resultsModel } = require('../models/search/resultsModel')
const { resultsQuery: query } = require('../queries/search/results')

module.exports = [
  {
    path: '/results',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query,
        failAction: async (request, h, error) => {
          if (!request.query.searchString.trim()) {
            return h.view(
              `search/${request.query.pageId || 'index'}`,
              await resultsModel(request, error)
            ).code(400).takeover()
          }

          return h.view('search/index', { ...request.query, errorList: [{ text: error.details[0].message }] }).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        request.query.searchString = encodeURIComponent(request.query.searchString)
        return h.view('search/results', await resultsModel(request))
      }
    }
  }
]
