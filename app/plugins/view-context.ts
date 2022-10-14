import config from '../config'

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server: any, _: any) => {
      server.ext('onPreResponse', function (request: any, h: any) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}
          ctx.serviceName = config.serviceName
          ctx.serviceUrl = config.startPageLink

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
