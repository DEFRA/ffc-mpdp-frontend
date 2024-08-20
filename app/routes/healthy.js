module.exports = {
  method: 'GET',
  path: '/healthy',
  handler: (_request, h) => h.response('ok').code(200)
}
