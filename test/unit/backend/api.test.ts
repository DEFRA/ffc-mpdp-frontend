const endpoint = 'http://__TEST_ENDPOINT__'
process.env.MPDP_BACKEND_ENDPOINT = endpoint

import wreck from '@hapi/wreck'
import fetch from "node-fetch"
import { get, getPaymentData, getPaymentDetails, post,getDownloadDetailsCsv } from '../../../app/backend/api'
import { getUrlParams } from '../../../app/utils/helper'

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('Backend API tests', () => {
    const route = '/__TEST_ROUTE__'
    test('service uses the env variable to connect to the backend service', async () => {
        const mockGet = jest.fn()
        const mockPost = jest.fn()
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)
        jest.spyOn(wreck, 'post').mockImplementation(mockPost)

        await get(route)
        await post(route, {})

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
        expect(mockPost).toHaveBeenCalledWith(`${endpoint}${route}`, { payload: {} })
    })

    test('get function handles error and shows a console error log', async () => {
        const mockConsoleErr = jest.fn()
        console.error = mockConsoleErr

        const mockGet = jest.fn().mockRejectedValue(null)
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        await get(route)

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
        expect(mockConsoleErr).toHaveBeenCalled()
    })

    test('post function handles error and shows a console error log', async () => {
        const mockConsoleErr = jest.fn()
        console.error = mockConsoleErr

        const mockPost = jest.fn().mockRejectedValue(null)
        jest.spyOn(wreck, 'post').mockImplementation(mockPost)

        await post(route, {})

        expect(mockPost).toHaveBeenCalledWith(`${endpoint}${route}`, { payload: {} })
        expect(mockConsoleErr).toHaveBeenCalled()
    })

    test('getPaymentData return empty results list if no response is received', async () => {
        const mockPost = jest.fn().mockResolvedValue(null)
        jest.spyOn(wreck, 'post').mockImplementation(mockPost)

        const searchString = '__TEST_STRING__'
        const offset = 0
        const sortBy = 'score'
        const filterBy = { schemes: [] }
        const res = await getPaymentData(searchString, offset, filterBy, sortBy)
        expect(res).toMatchObject({
			results: [],
			total: 0
		})

        expect(mockPost).toHaveBeenCalledWith(`${endpoint}/paymentdata`, { payload: {filterBy, limit: 20, offset, searchString ,sortBy} })
    })

    test('getPaymentData returns results from the payload in the right format', async () => {
        const mockData = [{
            payee_name: 'T R Carter & Sons 1',
            part_postcode: 'RG1',
            town: 'Reading',
            county_council: 'Berkshire',
            amount: '11142000.95'
        }]
        const mockPost = jest.fn().mockResolvedValue({
            payload: JSON.stringify({
                rows: mockData,
                count: 1
            })
        })
        jest.spyOn(wreck, 'post').mockImplementation(mockPost)

        const searchString = '__TEST_STRING__'
        const offset = 0
        const filterBy = { schemes: [] }
        const sortBy = 'score'
        const res = await getPaymentData(searchString, offset, filterBy, sortBy)
        expect(res).toMatchObject({
			results: mockData,
			total: mockData.length
		})

        expect(mockPost).toHaveBeenCalledWith(`${endpoint}/paymentdata`, { payload: { filterBy, limit: 20, offset, searchString, sortBy } })
    })

    test('getPaymentDetails returns null if no response is received', async () => {
        const mockGet = jest.fn().mockResolvedValue(null)
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        const payeeName = '__PAYEE_NAME__'
        const partPostcode = '__POST_CODE'
        const res = await getPaymentDetails(payeeName, partPostcode)
        expect(res).toBe(null)

        const route = getUrlParams('paymentdetails', { payeeName, partPostcode })

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
    })

    test('getPaymentDetails returns results', async () => {
        const mockData = [{
            payee_name: 'T R Carter & Sons 1',
            part_postcode: 'RG1',
            town: 'Reading',
            county_council: 'Berkshire',
            amount: '11142000.95'
        }]
        const mockGet = jest.fn().mockResolvedValue({
            payload: JSON.stringify(mockData)
        })
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        const payeeName = '__PAYEE_NAME__'
        const partPostcode = '__POST_CODE'
        const res = await getPaymentDetails(payeeName, partPostcode)
        expect(res).toMatchObject(mockData)

        const route = getUrlParams('paymentdetails', { payeeName, partPostcode })

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
    })

    test('getDownloadDetailsCsv returns results', async () => {
        const content ="TEST_CSV_CONTENT";
        const bufferedData = Buffer.from(content);
        const mockedResponse = new Response( bufferedData, {});
        const mockedFetch = fetch as jest.MockedFunctionDeep<typeof fetch>
        mockedFetch.mockResolvedValueOnce(mockedResponse);

        const payeeName = '__PAYEE_NAME__'
        const partPostcode = '__POST_CODE'
        const route = getUrlParams('downloaddetails', { payeeName, partPostcode })
        const res = await getDownloadDetailsCsv(payeeName, partPostcode)

        expect(mockedFetch).toHaveBeenCalledWith(`${endpoint}${route}`)
        expect(mockedFetch.mock.calls.length).toBe(1);
        expect(res).toBeInstanceOf(Buffer);
        expect(res).toEqual(bufferedData)
    })

})
