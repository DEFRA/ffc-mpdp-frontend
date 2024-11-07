const { initAll } = require('govuk-frontend')
require('./css/application.scss')

require('./js/search').init()
require('./js/scheme-payments-by-year').init()
require('./js/details').init()
require('./js/cookies').init()

initAll()
