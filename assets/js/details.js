module.exports = {
  init () {
    this.setupSchemeShowHideButtons()
    this.setupSummaryShowHideButton()
    this.setupShowAllButton()
  },

  setupShowAllButton () {
    const showAllButton = document.querySelector('#showAllButton')
    if (!showAllButton) {
      return
    }

    const detailsElements = document.querySelectorAll('.schemeDetails')
    const activitiesElements = document.querySelectorAll('.schemeActivity')

    showAllButton?.addEventListener('click', () => {
      const show = showAllButton.textContent === 'Show all'
      detailsElements.forEach((element) => {
        element.style.display = show ? 'block' : 'none'
      })

      activitiesElements.forEach((element) => {
        element.open = show
      })

      const allShowHideButtons = this.getAllSchemeShowHideButtons()
      allShowHideButtons.forEach((showHideButton, i) => {
        const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i + 1}`)
        this.toggleDisplay(schemeMoreInfo, show)
        this.toggleDetails(showHideButton, show)
      })

      showAllButton.textContent = show ? 'Hide all' : 'Show all'
    })
  },

  toggleDisplay (element, show) {
    element.style.display = show ? 'block' : 'none'
  },

  toggleDetails (element, show) {
    element.textContent = show ? 'Hide Details' : 'Show Details'
  },

  setupSummaryShowHideButton () {
    const showHideButton = document.getElementById('summaryToggle')
    if (!showHideButton) {
      return
    }

    const summaryDetails = document.getElementById('summaryDetails')
    const dateRange = document.getElementById('dateRange')

    // hide the details by default
    this.toggleDisplay(summaryDetails, false)
    this.toggleDisplay(dateRange, false)

    showHideButton?.addEventListener('click', () => {
      const show = document.getElementById('summaryToggle').textContent === 'Show Details'
      this.toggleDisplay(summaryDetails, show)
      this.toggleDisplay(dateRange, show)

      this.toggleDetails(showHideButton, show)
    })
  },

  setupSchemeShowHideButtons () {
    const allShowHideButtons = this.getAllSchemeShowHideButtons()
    if (!allShowHideButtons.length) {
      return
    }

    allShowHideButtons.forEach((showHideButton, i) => {
      if (!showHideButton) {
        return
      }

      const schemeDetails = document.getElementById(`schemeDetails${i + 1}`)
      const schemeMoreInfo = document.getElementById(`schemeMoreInfo${i + 1}`)

      // hide the details by default
      this.toggleDisplay(schemeDetails, false)
      this.toggleDisplay(schemeMoreInfo, false)

      showHideButton?.addEventListener('click', () => {
        const show = showHideButton.textContent === 'Show Details'
        this.toggleDisplay(schemeDetails, show)
        this.toggleDisplay(schemeMoreInfo, show)

        this.toggleDetails(showHideButton, show)
      })
    })
  },

  getAllSchemeShowHideButtons () {
    const allButtons = []
    const schemesLength = document.getElementById('mpdpSummaryBreakdown')?.getAttribute('data-schemesLength')
    for (let i = 1; i <= parseInt(schemesLength); i++) {
      allButtons.push(document.getElementById(`schemeToggle${i}`))
    }

    return allButtons
  }
}
