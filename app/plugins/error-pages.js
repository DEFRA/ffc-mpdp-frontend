module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, _) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const { payload } = response.output

          if (payload.statusCode >= 400 && payload.statusCode < 500) {
            return h.view('error-pages/4xx', { payload }).code(payload.statusCode)
          }

          request.log('error', {
            statusCode: payload.statusCode,
            message: payload.message,
            stack: response.data ? response.data.stack : response.stack
          })

          return h.view('error-pages/500').code(payload.statusCode)
        }

        return h.continue
      })
    }
  }
}
