import { start } from '../../../../app/server'
import Hapi from '@hapi/hapi';

describe('Server test', () => {

  test('Server gets created', async () => {
    const mockReturnValue = {
      register: jest.fn(),
      start: jest.fn(),
      settings: {
        host: '__TEST_HOST__'
      }
    }
    process.env.PORT = '3001'
    Hapi.server = jest.fn().mockReturnValue(mockReturnValue)

    const server = await start()
    expect(Hapi.server).toHaveBeenCalledWith({
      port: '3001',
      routes: expect.any(Object),
      router: expect.any(Object)
    })
    expect(server).toBe(mockReturnValue)
  })
})
