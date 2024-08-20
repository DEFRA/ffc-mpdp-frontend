const config = require('../config')
const { getPageTitle } = require('../utils/helper')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}
          ctx.serviceName = config.serviceName
          ctx.serviceUrl = config.startPageLink

          const { path } = request

          ctx.pageTitle = getPageTitle(path)
          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
