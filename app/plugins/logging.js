const config = require('../config')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    level: 'warn',
    logPayload: true,
    logQueryParams: true,
    prettyPrint: config.isDev
  }
}
