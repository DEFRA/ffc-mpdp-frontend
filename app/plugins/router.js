const routes = [].concat(
  require('../routes/assets'),
  require('../routes/health'),
  require('../routes/service-start'),
  require('../routes/cookies/cookies'),
  require('../routes/privacy'),
  require('../routes/accessibility'),
  require('../routes/download-all'),
  require('../routes/download-all-data'),
  require('../routes/search'),
  require('../routes/search/results'),
  require('../routes/details'),
  require('../routes/download-details'),
  require('../routes/search/suggestions'),
  require('../routes/download-results'),
  require('../routes/scheme-payments-by-year'),
  require('../routes/download-payments-by-year-summary')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}
