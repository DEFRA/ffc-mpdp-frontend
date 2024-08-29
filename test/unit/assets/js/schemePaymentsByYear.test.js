const schemePaymentsByYear = require('../../../../assets/js/schemePaymentsByYear')
const { JSDOM } = require('jsdom')
const dom = new JSDOM()

describe('search', () => {
  beforeAll(() => {
    global.document = dom.window.document
    global.window = dom.window
  })

  beforeEach(() => {
    document.body.innerHTML = `
          <div id='mpdpSummaryPanel'>
            <div>
              <div> 
                <h2 id='totalSchemes'>Payments from 2 schemes</h2>
              </div>
              <div> 
                <p>£99,999</p>
              </div>
            </div>
            <div id='summaryDetails'>
            </div>
            <div>
              <div> 
                <h2 id='totalYears'>Over 1 financial year</h2>
                <p id='dateRange'>1 April 2023 to 31 March 2024</p>
              </div>
              <div> 
                <button id='paymentsByYearSummaryToggle'>Show details</button>
              </div>
              <div style='height:20px;' class='govuk-!-margin-bottom-1 mpdp-position-relative'>
                <button id='showAllYearPaymentsButton'>Show all</button>
              </div>
            </div>
          </div>
        `
  })

  describe('constructor', () => {
    it('should call setupAggregateSummaryShowHideButton and setupAggregateShowAllButton', () => {
      const spySetupAggregateSummaryShowHideButton = jest.spyOn(schemePaymentsByYear, 'setupAggregateSummaryShowHideButton')
      const spySetupAggregateShowAllButton = jest.spyOn(schemePaymentsByYear, 'setupAggregateShowAllButton')

      schemePaymentsByYear.init()

      expect(spySetupAggregateSummaryShowHideButton).toHaveBeenCalled()
      expect(spySetupAggregateShowAllButton).toHaveBeenCalled()
    })
  })

  describe('setupAggregateSummaryShowHideButton', () => {
    it('should hide details and date range by default', () => {
      const summaryDetails = document.getElementById('summaryDetails')
      const dateRange = document.getElementById('dateRange')

      schemePaymentsByYear.setupAggregateSummaryShowHideButton()

      expect(summaryDetails.style.display).toBe('none')
      expect(dateRange.style.display).toBe('none')
    })

    it('should create a click event listener on showhidebutton', () => {
      const spyToggleDisplay = jest.spyOn(schemePaymentsByYear, 'toggleDisplay')
      const spyToggleDetails = jest.spyOn(schemePaymentsByYear, 'toggleDetails')

      schemePaymentsByYear.setupAggregateSummaryShowHideButton()

      document.getElementById('paymentsByYearSummaryToggle').dispatchEvent(new window.MouseEvent('click'))

      expect(spyToggleDisplay).toHaveBeenCalled()
      expect(spyToggleDetails).toHaveBeenCalled()
    })
  })

  describe('toggleDisplay', () => {
    it('should toggle the classname of an element', () => {
      const element = document.createElement('div')

      schemePaymentsByYear.toggleDisplay(element)
      expect(element.style.display).toBe('none')

      schemePaymentsByYear.toggleDisplay(element)
      expect(element.style.display).toBe('block')
    })
  })

  describe('toggleDetails', () => {
    it('should toggle the innerText of an element', () => {
      const element = document.createElement('div')
      element.innerText = 'Show Details'

      schemePaymentsByYear.toggleDetails(element)
      expect(element.innerText).toBe('Hide Details')

      schemePaymentsByYear.toggleDetails(element)
      expect(element.innerText).toBe('Show Details')
    })
  })

  describe('setupAggregateShowAllButton', () => {
    it('should toggle the innerText of the show payments button', () => {
      const button = document.getElementById('showAllYearPaymentsButton')

      schemePaymentsByYear.setupAggregateShowAllButton()

      button.dispatchEvent(new window.MouseEvent('click'))
      expect(button.innerText).toBe('Show all')

      button.dispatchEvent(new window.MouseEvent('click'))
      expect(button.innerText).toBe('Hide all')
    })
  })
})
