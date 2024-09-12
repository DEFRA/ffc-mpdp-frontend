'use strict'

const Hapi = require('@hapi/hapi')

const init = async function () {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
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
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/csvUpdate'))

  return server
}

const start = async function () {
  const server = await init()
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`)
  }
  await server.start()
  return server
}

module.exports = { start }
