const { journeys, serviceName } = require('../config')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}

          const { path } = request

          let journeyTitle = serviceName
          let serviceUrl = '/'

          if (path.startsWith('/service-start')) {
            journeyTitle = journeys.serviceStart.title
            serviceUrl = '/service-start'
          } else if (path.startsWith('/cookies')) {
            serviceUrl = '/cookies'
          }
          ctx.serviceName = journeyTitle
          ctx.serviceUrl = serviceUrl

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
