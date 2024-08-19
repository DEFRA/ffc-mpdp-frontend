const config = require('../config')
const { getCurrentPolicy, removeAnalytics } = require('../cookies')

const { cookie: { cookieNameCookiePolicy }, cookiePolicy } = config

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, _) => {
      server.state(cookieNameCookiePolicy, cookiePolicy)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (
          request.response.variety === 'view' &&
          statusCode !== 404 &&
          statusCode !== 500 &&
          request.response.source.manager._context
        ) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy =
            cookiesPolicy

          if ((!cookiesPolicy.analytics)) {
            removeAnalytics(request, h)
          }
        }

        return h.continue
      })
    }
  }
}
