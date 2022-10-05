import * as path from 'path'
import * as nunjucks from 'nunjucks'

import config from '../config'

const { version } = require('../../package.json')

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src: string, options: any) => {
          const template = nunjucks.compile(src, options.environment)

          return (context: any) => {
            return template.render(context)
          }
        },
        prepare: (options: any, next: (err?: Error) => void) => {
          options.compileOptions.environment = nunjucks.configure([
            path.join(options.relativeTo || process.cwd(), options.path),
            'node_modules/govuk-frontend/'
          ], {
            autoescape: true,
            watch: false
          })

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    context: {
      appVersion: version,
      assetPath: '/assets',
      pageTitle: config.serviceName
    }
  }
}
