const { start } = require('../app/server')

beforeEach(async () => {
  jest.setTimeout(10000)
  process.env.PORT = 3002
  globalThis.__SERVER__ = await start()
})
