describe('MPDP Cookies page test', () => {
  test('GET /cookies route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(200)
  })
})
  