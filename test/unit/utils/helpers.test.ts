import config from '../../../app/config'
import { 
    getReadableAmount, 
    getSchemeStaticData,
    getAllSchemesNames,
    getUrlParams, 
    getPageTitle, 
    removeTrailingSlash,
    getMatchingStaticAmounts
} from '../../../app/utils/helper'

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

        const amount5 = getReadableAmount(10000000.05)
        expect(amount5).toMatch('10,000,000.05')

        const amount6 = getReadableAmount(10000000.50)
        expect(amount6).toMatch('10,000,000.50')

        const amount7 = getReadableAmount(10000000.67)
        expect(amount7).toMatch('10,000,000.67')
    })

    test('getSchemeStaticData returns undefined if no matching schemeName is found', () => {
        const schemeData = getSchemeStaticData('__TEST_STRING__')
        expect(schemeData).toBeUndefined()
    })

    test('getSchemeStaticData returns correct static data', () => {
        const schemeData = getSchemeStaticData('Farming Resilience Fund')
        expect(schemeData).toBeDefined()
    })

    test('getSchemeStaticData performs case insensitive search', () => {
        const schemeData = getSchemeStaticData('Farming Resilience Fund')
        expect(schemeData?.name).toEqual('Farming Resilience Fund')
    })

    test('getAllSchemesNames returns all scheme names', () => {
        const allSchemeNames = getAllSchemesNames()
        expect(allSchemeNames.length).toBe(3)
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

    test('getPageTitle returns correct value', () => {
        expect(getPageTitle('/')).toEqual(config.routes['/'].title)
        expect(getPageTitle('/service-start')).toEqual(config.routes['/service-start'].title)
        expect(getPageTitle('/search')).toEqual(config.routes['/search'].title)
        expect(getPageTitle('__INVALID__')).toEqual('')
    })

    test('removeTrailingSlash returns correct value', () => {
        expect(removeTrailingSlash('/service-start/')).toEqual('/service-start')
        expect(removeTrailingSlash('/search')).toEqual('/search')
        expect(removeTrailingSlash('')).toEqual('')
    })

    test('getMatchingStaticAmounts returns correct value', () => {
        expect(getMatchingStaticAmounts(['12344'])).toEqual([{
            text: '£10,000 to £14,999',
            value: '10000-14999'
        }])
        expect(getMatchingStaticAmounts(['123','5467', '12398'])).toEqual([
            {
                text: '£0 to £1,999',
                value: '0-1999'
            },
            {
                text: '£5,000 to £9,999',
                value: '5000-9999'
            },
            {
                text: '£10,000 to £14,999',
                value: '10000-14999'
            },
        ])
        expect(getMatchingStaticAmounts(['32000'])).toEqual([{
            text: '£30,000 or more',
            value: '30000-'
        }])
    })
})