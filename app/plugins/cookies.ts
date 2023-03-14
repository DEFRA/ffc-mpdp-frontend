import config from '../config'
import { getCurrentPolicy, removeAnalytics } from '../cookies'

const { cookie: { cookieNameCookiePolicy }, cookiePolicy } = config

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server: any, _: any) => {
      server.state(cookieNameCookiePolicy, cookiePolicy)

      server.ext('onPreResponse', (request: any, h: any) => {
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

          // @ts-ignore
          if((!cookiesPolicy.analytics)) {
            removeAnalytics(request, h)
          }
        }

        return h.continue
      })
    }
  }
}
