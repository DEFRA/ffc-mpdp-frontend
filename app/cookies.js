const config = require('./config')
const { cookie: { cookieNameCookiePolicy } } = config

const getCurrentPolicy = (request, h) => {
  let cookiesPolicy = request.state[cookieNameCookiePolicy]
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

const createDefaultPolicy = h => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state(cookieNameCookiePolicy, cookiesPolicy, config.cookieConfig)
  return cookiesPolicy
}

const updatePolicy = (request, h, analytics) => {
  const cookiesPolicy = getCurrentPolicy(request, h)
  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state(cookieNameCookiePolicy, cookiesPolicy, config.cookieConfig)

  if (!analytics) {
    removeAnalytics(request, h)
  }
}

const removeAnalytics = (request, h) => {
  const googleCookiesRegex = /^_ga$|^_ga_*$|^_gid$|^_ga_.*$|^_gat_.*$/g
  Object.keys(request.state).forEach(cookieName => {
    if (cookieName.search(googleCookiesRegex) === 0) {
      h.unstate(cookieName)
    }
  })
}

module.exports = {
  getCurrentPolicy,
  updatePolicy,
  removeAnalytics
}