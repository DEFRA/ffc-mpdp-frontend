const { resultsModel } = require('../models/search/results')
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
          const { searchString, pageId } = request.query

          if (!searchString || !searchString?.trim()) {
            return h.view(
              `search/${pageId || 'index'}`,
              await resultsModel(request, error)
            ).code(400).takeover()
          }

          return h.view(
            'search/index',
            {
              ...request.query,
              errorList: [
                {
                  text: error.details[0].message
                }
              ]
            }).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const { searchString } = request.query

        if (!searchString || !searchString?.trim()) {
          return h.redirect(302, '/service-start')
        }

        request.query.searchString = encodeURIComponent(searchString)

        return h.view(
          'search/results',
          await resultsModel(request)
        )
      }
    }
  }
]
