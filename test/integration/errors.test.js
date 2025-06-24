const Joi = require('joi')

describe('errors plugin test', () => {
  test('errors plugin should be defined', () => {
    const errors = require('../../app/plugins/errors')
    expect(errors).toBeDefined()
  })

  test('test the invalid URL for 404 status', async () => {
    const options = {
      method: 'GET',
      url: '/invalidurl'
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
  }, 30000)

  test('Verify the plugins are registered to the server', async () => {
    expect(global.__SERVER__.registrations).toHaveProperty('errors')
    expect(global.__SERVER__.registrations).toHaveProperty('hapi-pino')
  }, 30000)

  test('should render 500 error view on internal server error', async () => {
    global.__SERVER__.route({
      method: 'GET',
      path: '/error-500',
      handler: () => {
        throw new Error('Simulated 500 error')
      }
    })

    const response = await global.__SERVER__.inject({
      method: 'GET',
      url: '/error-500'
    })

    expect(response.statusCode).toBe(500)
    expect(response.payload).toContain('Sorry, there is a problem with the service')
  }, 30000)

  test('should not render 500 error view on a successful request', async () => {
    global.__SERVER__.route({
      method: 'GET',
      path: '/success',
      handler: () => {
        return 'Success'
      }
    })

    const response = await global.__SERVER__.inject({
      method: 'GET',
      url: '/success'
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('Success')

    expect(response.statusCode).not.toBe(500)
    expect(response.payload).not.toContain('Sorry, there is a problem with the service')
  })
<<<<<<< HEAD
=======

  test('should render 500 error view for 404 not found error', async () => {
    const response = await global.__SERVER__.inject({
      method: 'GET',
      url: '/not-valid-path'
    })

    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Sorry, there is a problem with the service')
  })

  test('should render 500 error view for 400 bad request error', async () => {
    global.__SERVER__.route({
      method: 'POST',
      path: '/validate',
      options: {
        validate: {
          payload: Joi.object({
            requiredString: Joi.string().required()
          }),
          failAction: 'error'
        },
        handler: (request, h) => {
          return 'Valid payload'
        }
      }
    })

    const response = await global.__SERVER__.inject({
      method: 'POST',
      url: '/validate',
      payload: {}
    })

    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Sorry, there is a problem with the service')
  })

  test('should not render 500 error view valid payload', async () => {
    global.__SERVER__.route({
      method: 'POST',
      path: '/validate',
      options: {
        validate: {
          payload: Joi.object({
            requiredString: Joi.string().required()
          }),
          failAction: 'error'
        },
        handler: (request, h) => {
          return 'Valid payload'
        }
      }
    })

    const response = await global.__SERVER__.inject({
      method: 'POST',
      url: '/validate',
      payload: {
        requiredString: 'this-is-a-string'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Valid payload')
  })
>>>>>>> main
})
