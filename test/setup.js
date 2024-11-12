const { createServer } = require('../app/server')

beforeEach(async () => {
  jest.setTimeout(10000)
  process.env.PORT = 3002
  const server = await createServer()
  await server.initialize()
  globalThis.__SERVER__ = server
})
