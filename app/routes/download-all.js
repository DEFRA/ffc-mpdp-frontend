const { get } = require('../backend/api')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request, h) => {
    try {
      const content = await get('/file')
      return h.response(content?.payload)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename="ffc-payment-data.csv"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
