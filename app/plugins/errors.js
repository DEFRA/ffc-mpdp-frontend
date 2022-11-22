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
            message: response.message,
            payloadMessage: response.data ? response.data.payload.message : ''
          })
          return response
        }
        return h.continue
      })
    }
  }
}
