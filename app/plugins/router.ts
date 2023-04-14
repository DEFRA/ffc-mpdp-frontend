import { Server } from "@hapi/hapi";

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
  require('../routes/search'),
  require('../routes/search/results'),
  require('../routes/details'),
  require('../routes/search/suggestions'),
  require('../routes/downloaddetails')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes)
    }
  }
}
