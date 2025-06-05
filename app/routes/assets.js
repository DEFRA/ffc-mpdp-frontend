module.exports = {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'app/dist',
          'node_modules/govuk-frontend/dist/govuk/assets'
        ]
      }
    },
    cache: {
      privacy: 'private'
    },
    state: {
      parse: false,
      failAction: 'ignore'
    }
  }
}
