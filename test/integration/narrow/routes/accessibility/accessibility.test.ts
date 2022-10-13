describe('MPDP Accessibility page test', () => {
  test('GET /accessibility route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility'
    }

    const res = await global.__SERVER__.inject(options)
    expect(res.statusCode).toBe(200)
  })
})
