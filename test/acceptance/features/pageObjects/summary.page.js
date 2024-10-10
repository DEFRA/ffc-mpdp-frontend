const { $ } = require('@wdio/globals')
const Page = require('./page.js')

class SummaryPage extends Page {
  get summaryPanel () {
    return $('#mpdpSummaryPanel')
  }

  async isLoaded () {
    await expect(this.summaryPanel).toBeDisplayed()
  }
}
module.exports = new SummaryPage()
