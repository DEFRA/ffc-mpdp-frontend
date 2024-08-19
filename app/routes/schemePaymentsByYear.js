const { schemePaymentsByYearModel } = require('./models/schemePaymentsByYearModel')

module.exports = [
  {
    path: '/schemePaymentsByYear',
    method: 'GET',
    options: {
      auth: false,
      handler: async (_request, h) => {
        return h.view('scheme-payments-by-year/index', await schemePaymentsByYearModel())
      }
    }
  }
]
