import * as api from '../../../../app/backend/api'
import * as Http from 'http';

import wreck from '@hapi/wreck'
jest.mock('@hapi/wreck')
const mockedWreck = wreck as jest.Mocked<typeof wreck>;

describe('BackendHealthy test', () => {
  test('GET /backendHealthy route returns 200', async () => {
    mockedWreck.get.mockResolvedValue(
      {
        res: {} as unknown as Http.IncomingMessage,
        payload: {}
      })

    //jest.spyOn(api, 'get').mockResolvedValue({res: {} as IncomingMessage})
    await global.__SERVER__.inject({
      method: 'GET',
      url: '/backendHealthy'
    })

    expect(mockedWreck.get).toHaveBeenCalled()
  })
})
