const { JSDOM } = require('jsdom')
const dom = new JSDOM()
const search = require('../../../assets/js/search')
const schemePaymentsByYear = require('../../../assets/js/scheme-payments-by-year')
const details = require('../../../assets/js/details')
const cookies = require('../../../assets/js/cookies')

const spySearchInit = jest.spyOn(search, 'init')
const spySchemePaymentsByYearInit = jest.spyOn(schemePaymentsByYear, 'init')
const spyDetailsInit = jest.spyOn(details, 'init')
const spyCookiesInit = jest.spyOn(cookies, 'init')

jest.mock('govuk-frontend', () => ({ initAll: jest.fn() }))
jest.mock('../../../assets/css/application.scss', () => jest.fn())

describe('assets index', () => {
  beforeAll(() => {
    global.document = dom.window.document
    global.window = dom.window
  })

  it('should import and initiate all scripts', () => {
    require('../../../assets')

    expect(spySearchInit).toHaveBeenCalled()
    expect(spySchemePaymentsByYearInit).toHaveBeenCalled()
    expect(spyDetailsInit).toHaveBeenCalled()
    expect(spyCookiesInit).toHaveBeenCalled()
  })
})
