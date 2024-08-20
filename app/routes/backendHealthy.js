const { get } = require('../backend/api')

module.exports = {
  method: 'GET',
  path: '/backendHealthy',
  handler: async (_request, h) => {
    const result = await get('/healthy')
    return h.response(result.res.statusMessage).code(200)
  }
}
