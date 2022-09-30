describe('Healthy test', () => {
  test('GET /healthy route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
  })
})
