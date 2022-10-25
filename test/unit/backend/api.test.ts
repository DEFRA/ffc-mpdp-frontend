process.env.MPDP_BACKEND_ENDPOINT = 'http://__TEST_ENDPOINT__'
import wreck from '@hapi/wreck'
import { get } from '../../../app/backend/api'

describe('Backend API tests', () => {
    const endpoint = 'http://__TEST_ENDPOINT__'
    const route = '/__TEST_ROUTE__'

    test('service uses the env variable to connect to the backend service', async () => {
        const mockGet = jest.fn()
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        await get(route)

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
    })
})