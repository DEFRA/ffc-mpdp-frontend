const { initAll } = require('govuk-frontend')
require('./css/application.scss')

require('./js/search').init()
require('./js/schemePaymentsByYear').init()
require('./js/details').init()
require('./js/cookies').init()

initAll()
