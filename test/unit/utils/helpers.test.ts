import { getReadableAmount, getSchemeStaticData, getUrlParams } from '../../../app/utils/helper'

describe('helper module tests', () => {
    test('getReadableAmount returns a 0 if number is undefined', () => {
        const amount = getReadableAmount(undefined)
        expect(amount).toMatch('0')
    })

    test('getReadableAmount returns a number with commas in the right place', () => {
        const amount = getReadableAmount(10000)
        expect(amount).toMatch('10,000')

        const amount2 = getReadableAmount(100000)
        expect(amount2).toMatch('100,000')

        const amount3 = getReadableAmount(1000000)
        expect(amount3).toMatch('1,000,000')

        const amount4 = getReadableAmount(10000000)
        expect(amount4).toMatch('10,000,000')
    })

    test('getSchemeStaticData returns undefined if no matching schemeName is found', () => {
        const schemeData = getSchemeStaticData('__TEST_STRING__')
        expect(schemeData).toBeUndefined()
    })

    test('getSchemeStaticData returns correct static data', () => {
        const schemeData = getSchemeStaticData('Farming Equipment and Technology Fund')
        expect(schemeData).toBeDefined()
    })

    test('getUrlParams returns correct value', () => {
        const page = '__TEST_ROUTE__'
        const obj = {
            val: '__VALUE__',
            anotherVal: '__ANOTHER_VALUE__'
        }

        const url = getUrlParams(page, obj)
        expect(url).toMatch(`/${page}?val=${obj.val}&anotherVal=${obj.anotherVal}`)
    })
})