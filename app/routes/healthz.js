module.exports = {
  method: 'GET',
  path: '/healthz',
  handler: (_request, h) => h.response('ok').code(200)
}
