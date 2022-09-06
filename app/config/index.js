const Joi = require('joi')

const schema = Joi.object({
  cache: {
    expiresIn: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
    options: {
      host: Joi.string().default('redis-hostname.default'),
      partition: Joi.string().default('ffc-mpdp-frontend'),
      password: Joi.string().allow(''),
      port: Joi.number().default(6379),
      tls: Joi.object()
    }
  },
  cookie: {
    cookieNameCookiePolicy: Joi.string().default('ffc_mpdp_cookie_policy'),
    cookieNameAuth: Joi.string().default('ffc_mpdp_auth'),
    cookieNameSession: Joi.string().default('ffc_mpdp_session'),
    isSameSite: Joi.string().default('Lax'),
    isSecure: Joi.boolean().default(true),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(1000 * 3600 * 24 * 3) // 3 days
  },
  cookiePolicy: {
    clearInvalid: Joi.bool().default(false),
    encoding: Joi.string().valid('base64json').default('base64json'),
    isSameSite: Joi.string().default('Lax'),
    isSecure: Joi.bool().default(true),
    password: Joi.string().min(32).required(),
    path: Joi.string().default('/'),
    ttl: Joi.number().default(1000 * 60 * 60 * 24 * 365) // 1 year
  },
  env: Joi.string().valid('development', 'test', 'production').default(
    'development'
  ),
  googleTagManagerKey: Joi.string().allow(null, ''),
  isDev: Joi.boolean().default(false),
  port: Joi.number().default(3000),
  serviceName: Joi.string().default('Making Payment Data Public'),
  journeys: {
    serviceStart: { title: Joi.string() }
  },
  serviceUri: Joi.string().uri(),
  useRedis: Joi.boolean().default(false),
  testToken: Joi.string().uuid().optional()
})

const config = {
  cache: {
    options: {
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined
    }
  },
  cookie: {
    cookieNameCookiePolicy: 'ffc_mpdp_cookie_policy',
    cookieNameAuth: 'ffc_mpdp_auth',
    cookieNameSession: 'ffc_mpdp_session',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production',
    password: process.env.COOKIE_PASSWORD
  },
  cookiePolicy: {
    clearInvalid: false,
    encoding: 'base64json',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production',
    password: process.env.COOKIE_PASSWORD
  },
  env: process.env.NODE_ENV,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  serviceUri: process.env.SERVICE_URI,
  useRedis: process.env.NODE_ENV !== 'test',
  journeys: {
    serviceStart: {
      title: 'Find data on farm and land payments'
    }
  },
  testToken: process.env.TEST_TOKEN
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
