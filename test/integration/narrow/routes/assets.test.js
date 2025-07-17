describe('Assets tests', () => {
  test('GET /assets route returns 404 if no parameters provided', async () => {
    const options = {
      method: 'GET',
      url: '/assets'
    }
    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(404)
  })

  test('GET /assets/{path} route returns 404 if asset does not exist', async () => {
    const options = {
      method: 'GET',
      url: '/assets/nonexistent.js'
    }
    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(404)
  })

  test('GET /assets/{path} route returns asset file if asset exists', async () => {
    const options = {
      method: 'GET',
      url: '/assets/assets.js'
    }
    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toBe('text/javascript; charset=utf-8')
  })
})
