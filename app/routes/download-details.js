const { getDownloadDetailsCsv } = require('../backend/api')
const Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/downloaddetails',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        payeeName: Joi.string().trim().required(),
        partPostcode: Joi.string().trim().required()
      }),
      failAction: async (_request, h, error) => {
        return h.response(error.toString()).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const { payeeName, partPostcode } = request.query
      const content = await getDownloadDetailsCsv(payeeName, partPostcode)
      return h.response(content)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename="ffc-payment-details.csv"')
    }
  }
}
