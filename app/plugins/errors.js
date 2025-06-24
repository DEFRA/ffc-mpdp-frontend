module.exports = {
  plugin: {
    name: 'errors',
    register: (server) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const statusCode = response.output.statusCode

          if (statusCode === 404) {
            return h.view('errors/404').code(statusCode)
          }

          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message,
            stack: response.stack
          })

          return h.view('errors/500').code(statusCode)
        }
        return h.continue
      })
    }
  }
}
