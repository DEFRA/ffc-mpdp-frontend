const { get } = require('../backend/api')

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request, h) => {
    try {
      const content = await get('/downloadPaymentsByYearSummary')
      return h
        .response(content?.payload)
        .type('application/csv')
        .header(
          'Content-Disposition',
          'attachment; filename="ffc-payments-by-year.csv"'
        )
    } catch (error) {
      return h.response(error).code(500)
    }
  }
}
