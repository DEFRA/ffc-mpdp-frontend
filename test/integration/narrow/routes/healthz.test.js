describe('Healthz test', () => {
  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
  })
})
