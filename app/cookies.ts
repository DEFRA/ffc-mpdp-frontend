import { Request, ResponseToolkit } from "@hapi/hapi";

import config from './config'
const { cookie: { cookieNameCookiePolicy } } = config

export const getCurrentPolicy = (request: Request, h: ResponseToolkit) => {
  let cookiesPolicy = request.state[cookieNameCookiePolicy]
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

const createDefaultPolicy = (h: ResponseToolkit) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state(cookieNameCookiePolicy, cookiesPolicy)
  return cookiesPolicy
}

export const updatePolicy = (request: Request, h: ResponseToolkit, analytics: any) => {
  const cookiesPolicy = getCurrentPolicy(request, h)
  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state(cookieNameCookiePolicy, cookiesPolicy)

  if (!analytics) {
    removeAnalytics(request, h)
  }
}

const removeAnalytics = (request: Request, h: ResponseToolkit) => {
  const googleCookiesRegex = /^_ga$|^_ga_*$|^_gid$|^_ga_.*$|^_gat_.*$/g
  Object.keys(request.state).forEach(cookieName => {
    if (cookieName.search(googleCookiesRegex) === 0) {
      h.unstate(cookieName)
    }
  })
}
