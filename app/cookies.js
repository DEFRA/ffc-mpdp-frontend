const { cookie: { cookieNameCookiePolicy } } = require('./config')

function getCurrentPolicy (request, h) {
  let cookiesPolicy = request.state[cookieNameCookiePolicy]
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

function createDefaultPolicy (h) {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state(cookieNameCookiePolicy, cookiesPolicy)
  return cookiesPolicy
}

function updatePolicy (request, h, analytics) {
  const cookiesPolicy = getCurrentPolicy(request, h)

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state(cookieNameCookiePolicy, cookiesPolicy)

  if (!analytics) {
    removeAnalytics(request, h)
  }
}

function removeAnalytics (request, h) {
  const googleCookiesRegex = /^_ga$|^_gid$|^_ga_.*$|^_gat_.*$/g
  Object.keys(request.state).forEach(cookieName => {
    if (cookieName.search(googleCookiesRegex) === 0) {
      h.unstate(cookieName)
    }
  })
}

module.exports = {
  getCurrentPolicy,
  updatePolicy
}
