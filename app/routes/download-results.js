const { post } = require('../backend/api')
const { resultsQuery: query } = require('./queries/search/results')

module.exports = {
  path: '/downloadresults',
  method: 'GET',
  options: {
    auth: false,
    validate: {
      query,
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      const { searchString, schemes, amounts, counties, years } = request.query
      const sortBy = decodeURIComponent(request.query.sortBy)
      const filterBy = {
        schemes: typeof schemes === 'string' ? [schemes] : schemes,
        amounts: typeof amounts === 'string' ? [amounts] : amounts,
        counties: typeof counties === 'string' ? [counties] : counties,
        years: typeof years === 'string' ? [years] : years
      }

      const content = await post('/file', { searchString, filterBy, sortBy })
      return h
        .response(content?.payload)
        .type('application/csv')
        .header(
          'Content-Disposition',
          'attachment; filename="ffc-payment-results.csv"'
        )
    }
  }
}
