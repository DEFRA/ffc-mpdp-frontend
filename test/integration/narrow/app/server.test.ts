import { start } from '../../../../app/server'

describe('Server test', () => {

  test('Server gets created', () => {
    console.log = jest.fn()
    
    expect(global.__SERVER__.settings.port).toEqual(3000)
    expect(console.log).toHaveBeenCalledTimes(0)
    jest.resetAllMocks()
  })

  test('Server uses env variables', async () => {
    console.log = jest.fn()
    
    const currentPort = process.env.PORT
    const currentEnv = process.env.NODE_ENV

    process.env.PORT = '3001'
    process.env.NODE_ENV = 'development'

    const server = await start()
    expect(server.settings.port).toEqual(3001)
    expect(console.log).toHaveBeenCalledTimes(1)

    await server.stop()
    process.env.port = currentPort;
    process.env.NODE_ENV = currentEnv;
  })
})
