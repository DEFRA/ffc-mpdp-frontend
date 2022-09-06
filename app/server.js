const config = require('./config')
const Hapi = require('@hapi/hapi')
const catbox = config.useRedis
  ? require('@hapi/catbox-redis')
  : require('@hapi/catbox-memory')
const cacheConfig = config.useRedis ? config.cache.options : {}

const createServer = async () => {
  const server = Hapi.server({
    cache: [{
      provider: {
        constructor: catbox,
        options: cacheConfig
      }
    }],
    port: config.port,
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

  const magiclinkCache = server.cache({
    expiresIn: 1000 * 60 * 15,
    segment: 'magiclinks'
  }) // 15 mins
  server.app.magiclinkCache = magiclinkCache

  await server.register(require('@hapi/cookie'))
  await server.register(require('@hapi/crumb'))
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/views'))

  if (config.isDev) {
    await server.register(require('blipp'))
  }

  return server
}

module.exports = createServer
