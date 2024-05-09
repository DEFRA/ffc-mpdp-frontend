module.exports = {
  plugin: {
    name: 'errors',
    register: (server) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response
        if (response.isBoom) {
          const statusCode = response.output.statusCode
          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message,
            stack: response.stack
          })
          return response
        }
        return h.continue
      })
    }
  }
}
