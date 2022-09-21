const routes = [].concat(
  require('../routes/assets'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/service-start')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
