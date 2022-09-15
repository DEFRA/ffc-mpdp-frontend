const Hapi = require('@hapi/hapi')

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })
  
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/views'))
  
  return server
}

module.exports = createServer
