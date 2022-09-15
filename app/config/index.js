const Joi = require('joi')

const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default(
    'development'
  ),
  isDev: Joi.boolean().default(false),
  port: Joi.number().default(3000),
  serviceName: Joi.string().default('Make Payment Data Public')
})

const config = {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
