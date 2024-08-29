const showDetailsText = 'Show Details'
const details = require('../../../../assets/js/details')
const { JSDOM } = require('jsdom')
const dom = new JSDOM()

describe('details', () => {
  let showAllButton
  let summaryToggle
  let summaryDetails
  let dateRange

  beforeAll(() => {
    global.document = dom.window.document
    global.window = dom.window
  })

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mpdpSummaryBreakdown" data-schemesLength="2">
        <button id="showAllButton">Show all</button>
        <button id="summaryToggle">Show Details</button>
        <div id="summaryDetails" style="display: none;"></div>
        <div id="dateRange" style="display: none;"></div>
        
        <div id="schemeDetails1" class="schemeDetails" style="display: none;"></div>
        <div id="schemeMoreInfo1" style="display: none;"></div>
        <details id="schemeActivity1" class="schemeActivity"></details>
        <button id="schemeToggle1">Show Details</button>

        <div id="schemeDetails2" class="schemeDetails" style="display: none;"></div>
        <div id="schemeMoreInfo2" style="display: none;"></div>
        <details id="schemeActivity2" class="schemeActivity"></details>
        <button id="schemeToggle2">Show Details</button>
      </div>
    `

    showAllButton = document.getElementById('showAllButton')
    summaryToggle = document.getElementById('summaryToggle')
    summaryDetails = document.getElementById('summaryDetails')
    dateRange = document.getElementById('dateRange')

    details.init()
  })

  describe('init', () => {
    it('should initialize and call setup functions', () => {
      const spySetupSchemeShowHideButtons = jest.spyOn(details, 'setupSchemeShowHideButtons')
      const spySetupSummaryShowHideButton = jest.spyOn(details, 'setupSummaryShowHideButton')
      const spySetupShowAllButton = jest.spyOn(details, 'setupShowAllButton')

      details.init()

      expect(spySetupSchemeShowHideButtons).toHaveBeenCalled()
      expect(spySetupSummaryShowHideButton).toHaveBeenCalled()
      expect(spySetupShowAllButton).toHaveBeenCalled()
    })
  })

  describe('setupShowAllButton', () => {
    it('should toggle visibility of all elements when "Show all" button is clicked', () => {
      showAllButton.click()

      for (let i = 0; i < 2; i++) {
        expect(document.getElementById(`schemeDetails${i + 1}`).style.display).toBe('block')
        expect(document.getElementById(`schemeMoreInfo${i + 1}`).style.display).toBe('block')
      }

      expect(showAllButton.textContent).toBe('Hide all')
    })

    it('should toggle visibility back when "Hide all" button is clicked', () => {
      showAllButton.click() // Show all
      showAllButton.click() // Hide all

      for (let i = 0; i < 2; i++) {
        expect(document.getElementById(`schemeDetails${i + 1}`).style.display).toBe('none')
        expect(document.getElementById(`schemeMoreInfo${i + 1}`).style.display).toBe('none')
      }

      expect(showAllButton.textContent).toBe('Show all')
    })
  })

  describe('setupSummaryShowHideButton', () => {
    it('should hide summary details and date range by default', () => {
      expect(summaryDetails.style.display).toBe('none')
      expect(dateRange.style.display).toBe('none')
    })

    it('should toggle visibility of summary details when summary toggle is clicked', () => {
      summaryToggle.click()

      expect(summaryDetails.style.display).toBe('block')
      expect(dateRange.style.display).toBe('block')
      expect(summaryToggle.textContent).toBe('Hide Details')
    })
  })

  describe('setupSchemeShowHideButtons', () => {
    it('should hide scheme details and more info by default', () => {
      for (let i = 0; i < 2; i++) {
        expect(document.getElementById(`schemeDetails${i + 1}`).style.display).toBe('none')
        expect(document.getElementById(`schemeMoreInfo${i + 1}`).style.display).toBe('none')
      }
    })

    it('should toggle visibility of scheme details when individual toggle is clicked', () => {
      const schemeDetails = document.getElementById('schemeDetails1')
      const schemeMoreInfo = document.getElementById('schemeMoreInfo1')
      const schemeToggle = document.getElementById('schemeToggle1')

      schemeToggle.click()

      expect(schemeDetails.style.display).toBe('block')
      expect(schemeMoreInfo.style.display).toBe('block')
      expect(schemeToggle.textContent).toBe('Hide Details')

      schemeToggle.click()

      expect(schemeDetails.style.display).toBe('none')
      expect(schemeMoreInfo.style.display).toBe('none')
      expect(schemeToggle.textContent).toBe('Show Details')
    })
  })

  describe('toggleDisplay', () => {
    let schemeDetails

    beforeAll(() => {
      schemeDetails = document.getElementById('schemeDetails1')
    })

    it('should set display to block when show is true', () => {
      details.toggleDisplay(schemeDetails, true)
      expect(schemeDetails.style.display).toBe('block')
    })

    it('should set display to none when show is false', () => {
      details.toggleDisplay(schemeDetails, false)
      expect(schemeDetails.style.display).toBe('none')
    })
  })

  describe('toggleDetails', () => {
    let schemeToggle

    beforeAll(() => {
      schemeToggle = document.getElementById('schemeToggle1')
    })

    it('should set innerText to "Hide Details" when show is true', () => {
      details.toggleDetails(schemeToggle, true)
      expect(schemeToggle.textContent).toBe('Hide Details')
    })

    it('should set innerText to "Show Details" when show is false', () => {
      details.toggleDetails(schemeToggle, false)
      expect(schemeToggle.textContent).toBe(showDetailsText)
    })
  })
})
