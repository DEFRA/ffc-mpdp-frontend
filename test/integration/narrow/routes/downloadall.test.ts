describe('Download all test', () => {
  test('GET /downloadall route returns 301', async () => {
    const res = await global.__SERVER__.inject({
      method: 'GET',
      url: '/downloadall'
    })
    expect(res.statusCode).toBe(301)
  })
})
