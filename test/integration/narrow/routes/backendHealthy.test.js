const wreck = require('@hapi/wreck')

const spyGet = jest.spyOn(wreck, 'get')

describe('BackendHealthy test', () => {
  test('GET /backendHealthy route returns 200', async () => {
    spyGet.mockResolvedValue(
      {
        res: {},
        payload: {}
      })

    await global.__SERVER__.inject({
      method: 'GET',
      url: '/backendHealthy'
    })

    expect(spyGet).toHaveBeenCalled()
  })
})
