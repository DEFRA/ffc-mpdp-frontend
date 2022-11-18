import { getReadableAmount } from '../../../app/utils/helper'

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
})