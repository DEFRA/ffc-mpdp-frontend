const { schemePaymentsByYearModel } = require('./models/scheme-payments-by-year')

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
