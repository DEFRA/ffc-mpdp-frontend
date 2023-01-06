type config = {
  cookie: {
    cookieNameCookiePolicy: string,
    cookieNameAuth: string,
    cookieNameSession: string,
    isSameSite: string,
    isSecure: boolean
  },
  cookiePolicy: {
    clearInvalid: boolean,
    encoding: string,
    isSameSite: string,
    isSecure: boolean
  },
  env: string,
  googleTagManagerKey: string | null,
  port: number,
  serviceName: string,
  startPageLink: string,
  backendEndpoint: string,
  search: {
    limit: number
  },
  routes: {
    [key: string]: {
      title: string
    }
  }
}

export default {
  cookie: {
    cookieNameCookiePolicy: 'ffc_mpdp_cookie_policy',
    cookieNameAuth: 'ffc_mpdp_auth',
    cookieNameSession: 'ffc_mpdp_session',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production'
  },
  cookiePolicy: {
    clearInvalid: false,
    encoding: 'base64json',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production'
  },
  env: process.env.NODE_ENV,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  port: process.env.PORT? parseInt(process.env.PORT) : 3001,
  serviceName: 'Find data on farm and land payments',
  startPageLink: '/service-start',
  backendEndpoint: process.env.MPDP_BACKEND_ENDPOINT,
  search: {
    limit: 20
  },
  routes: {
    '/': {
      title: 'Find data on farm and land payments'
    },
    '/service-start': {
      title: 'Find data on farm and land payments'
    },
    '/search': {
      title: 'Search for a business or agreement holder'
    },
    '/results': {
      title: 'Search for a business or agreement holder'
    },
    '/cookies': {
      title: 'Cookies'
    }
  }
} as config
