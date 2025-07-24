const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../config')
const { version } = require('../../package.json')
const { getPageTitle } = require('../utils/helper')

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return context => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          const nunjucksEnv = nunjucks.configure([
            path.join(options.relativeTo || process.cwd(), options.path),
            'node_modules/govuk-frontend/dist'
          ], {
            autoescape: true,
            watch: false
          })

          nunjucksEnv.addGlobal('govukRebrand', true)

          options.compileOptions.environment = nunjucksEnv

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    context: function (request) {
      return {
        cookiesPolicy: request.response.source.manager._context.cookiesPolicy,
        appVersion: version,
        assetPath: '/assets',
        serviceName: config.serviceName,
        pageTitle: getPageTitle(request.path),
        serviceUrl: config.startPageLink,
        googleTagManagerKey: config.googleTagManagerKey
      }
    }
  }
}
