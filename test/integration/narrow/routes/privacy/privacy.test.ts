describe('MPDP Privacy page test', () => {
  test('GET /privacy route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/privacy'
    }

    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(200)
  })
})
  