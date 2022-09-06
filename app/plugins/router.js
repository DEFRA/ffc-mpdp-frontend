const routes = [].concat(
  require('../routes/assets'),
  require('../routes/service-start'),
  require('../routes/cookies'),
  require('../routes/healthy'),
  require('../routes/healthz')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
