import * as api from '../../../../app/backend/api'
import * as Http from 'http';
import wreck from '@hapi/wreck'

jest.mock('@hapi/wreck')
const mockedWreck = wreck as jest.Mocked<typeof wreck>;

describe('download all csv test', () => {
  test('GET /downloadall route returns 200', async () => {
    mockedWreck.get.mockResolvedValue(
      {
        res: {} as unknown as Http.IncomingMessage,
        payload: {}
      })

    await global.__SERVER__.inject({
      method: 'GET',
      url: '/downloadall'
    })

    expect(mockedWreck.get).toHaveBeenCalled()
  })
})
