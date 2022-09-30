import { start } from '../../../../src/server'
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
    Hapi.server = jest.fn().mockReturnValue(mockReturnValue)

    const server = await start()
    expect(Hapi.server).toHaveBeenCalled()
    expect(server).toBe(mockReturnValue)
  })
})
