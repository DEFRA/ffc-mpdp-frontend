const { serviceName } = require('../config/config')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}
          ctx.serviceName = serviceName
          ctx.serviceUrl = `/${request.path}`

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
