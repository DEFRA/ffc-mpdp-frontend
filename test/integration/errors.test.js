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
})
