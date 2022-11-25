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
})