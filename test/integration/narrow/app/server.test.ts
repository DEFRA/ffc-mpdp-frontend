import { start } from '../../../../src/server'

describe('Server test', () => {
  test('createServer returns server', async () => {
    const server = await start()
    expect(server).toBeDefined()
  })
})
