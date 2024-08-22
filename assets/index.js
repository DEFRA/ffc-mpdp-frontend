const { initAll } = require('govuk-frontend')
require('./js/search').init()
require('./js/schemePaymentsByYear').init()
require('./css/application.scss')
require('./js/cookies')
require('./js/details')

initAll()
