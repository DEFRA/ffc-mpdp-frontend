require('./insights').setup()
const Hapi = require('@hapi/hapi')

const tServer = Hapi.server({
  port: process.env.PORT
})

const routes = [].concat(
  require('./routes/healthy'),
  require('./routes/healthz')
)

tServer.route(routes)

module.exports = tServer
