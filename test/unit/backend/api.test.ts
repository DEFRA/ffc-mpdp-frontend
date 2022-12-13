const endpoint = 'http://__TEST_ENDPOINT__'
process.env.MPDP_BACKEND_ENDPOINT = endpoint

import wreck from '@hapi/wreck'
import { get, getPaymentData, getPaymentDetails } from '../../../app/backend/api'
import { getUrlParams } from '../../../app/utils/helper'

describe('Backend API tests', () => {
    const route = '/__TEST_ROUTE__'
    test('service uses the env variable to connect to the backend service', async () => {
        const mockGet = jest.fn()
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        await get(route)

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
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

    test('getPaymentData return empty results list if no response is received', async () => {
        const mockGet = jest.fn().mockResolvedValue(null)
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        const searchString = '__TEST_STRING__'
        const offset = 0
        const res = await getPaymentData(searchString, offset)
        expect(res).toMatchObject({
			results: [],
			total: 0
		})

        const route = getUrlParams('paymentdata',{
            searchString,
            limit: 20,
            offset
        })

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
    })

    test('getPaymentData returns results from the payload in teh right format', async () => {
        const mockData = [{
            payee_name: 'T R Carter & Sons 1',
            part_postcode: 'RG1',
            town: 'Reading',
            county_council: 'Berkshire',
            amount: '11142000.95'
        }]
        const mockGet = jest.fn().mockResolvedValue({
            payload: JSON.stringify({
                rows: mockData,
                count: 1
            })
        })
        jest.spyOn(wreck, 'get').mockImplementation(mockGet)

        const searchString = '__TEST_STRING__'
        const offset = 0
        const res = await getPaymentData(searchString, offset)
        expect(res).toMatchObject({
			results: mockData,
			total: mockData.length
		})

        const route = getUrlParams('paymentdata',{
            searchString,
            limit: 20,
            offset
        })

        expect(mockGet).toHaveBeenCalledWith(`${endpoint}${route}`)
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
})
