const routes = [].concat(
  require('../routes/assets'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/service-start'),
  require('../routes/cookies/cookies'),
  require('../routes/privacy'),
  require('../routes/accessibility'),
  require('../routes/backendHealthy'),
  require('../routes/downloadall'),
  require('../routes/downloadAllData'),
  require('../routes/search'),
  require('../routes/search/results'),
  require('../routes/details'),
  require('../routes/downloaddetails'),
  require('../routes/search/suggestions'),
  require('../routes/downloadresults'),
  require('../routes/schemePaymentsByYear'),
  require('../routes/downloadPaymentsByYearSummary')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}
