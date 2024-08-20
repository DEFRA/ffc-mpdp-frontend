const { start } = require('../app/server')

beforeEach(async () => {
  jest.setTimeout(10000)
  globalThis.__SERVER__ = await start()
})
