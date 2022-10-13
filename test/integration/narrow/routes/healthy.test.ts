describe('Healthy test', () => {
  test('GET /healthy route returns 200', async () => {
    const res = await global.__SERVER__.inject({
      method: 'GET',
      url: '/healthy'
    })

    expect(res.statusCode).toBe(200)
  })
})
