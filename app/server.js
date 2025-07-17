const Hapi = require('@hapi/hapi')

async function createServer () {
  const server = Hapi.server({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3001,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      state: {
        failAction: 'ignore'
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/cookies'))

  return server
}

module.exports = { createServer }
