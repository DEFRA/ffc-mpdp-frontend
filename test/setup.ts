import { start } from '../src/server'

declare var global: any;

beforeEach(async () => {
  jest.setTimeout(10000)
  globalThis.__SERVER__ = await start()
})
