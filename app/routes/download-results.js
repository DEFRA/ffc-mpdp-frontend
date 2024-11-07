const { getPaymentData } = require('../backend/api')
const { getReadableAmount } = require('../utils/helper')
const { resultsQuery: query } = require('./queries/search/results')
const { Parser } = require('json2csv')

module.exports = [
  {
    path: '/downloadresults',
    method: 'GET',
    options: {
      auth: false,
      validate: {
        query,
        failAction: async (_request, h, error) => {
          h.response(error.toString()).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const csvFields = [
          'payee_name',
          'part_postcode',
          'town',
          'county_council',
          'amount'
        ]
        const action = 'download'
        const offset = 0
        const limit = -1
        const { searchString, schemes, amounts, counties, years } = request.query
        const sortBy = decodeURIComponent(request.query.sortBy)
        const filterBy = {
          schemes: typeof schemes === 'string' ? [schemes] : schemes,
          amounts: typeof amounts === 'string' ? [amounts] : amounts,
          counties: typeof counties === 'string' ? [counties] : counties,
          years: typeof years === 'string' ? [years] : years
        }

        const { results } = await getPaymentData(searchString, offset, filterBy, sortBy, action, limit)
        const matches = results.map(x => ({ ...x, amount: getReadableAmount(parseFloat(x.total_amount)) }))
        const csvParser = new Parser({ fields: csvFields })
        const csv = csvParser.parse(matches)
        return h.response(csv)
          .type('application/csv')
          .header('Content-Disposition', 'attachment; filename="ffc-payment-results.csv"')
      }
    }
  }
]
