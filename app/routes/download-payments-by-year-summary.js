const { get } = require('../backend/api')

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request, _response) => {
    try {
      const content = await get('/downloadPaymentsByYearSummary')
      return _response
        .response(content?.payload)
        .type('application/csv')
        .header(
          'Content-Disposition',
          'attachment; filename="ffc-payments-by-year.csv"'
        )
    } catch (error) {
      return _response.response(error).code(500)
    }
  }
}
