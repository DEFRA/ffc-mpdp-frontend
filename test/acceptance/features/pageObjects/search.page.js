const { $ } = require('@wdio/globals')
const Page = require('./page.js')

class SearchPage extends Page {
  get searchTextInput () {
    return $('#searchInput')
  }

  get searchButton () {
    return $('a[href="/search"]')
  }

  get totalResults () {
    return $('#totalResults')
  }

  get suggestionsDivSelector () {
    return $('#suggestions div')
  }

  async isLoaded () {
    await expect(this.searchTextInput).toBeDisplayed()
  }

  async searchForAnAgreementHolder (searchTerm) {
    const apiEndpoint = '/suggestions?searchString=Leeds'
    browser.setupInterceptor()
    await this.searchTextInput.setValue(searchTerm)
    // Wait for the search suggestions to come back with some response
    await super.waitForResponse(apiEndpoint)
    browser.disableInterceptor()
  }

  async search (searchTerm) {
    await this.searchTextInput.setValue(searchTerm)
    await this.searchButton.click()
    await expect(this.totalResults).toBeVisible()
  }

  async selectResultFromSearchSuggestions (resultIndex) {
    // Wait for two results to appear in the search suggestions so the first result can be selected
    const nthElementSelectorToWaitFor = `#suggestions div:nth-child(${resultIndex + 1})`

    await super.waitForNthElement(nthElementSelectorToWaitFor)

    // Verify that the nth element is indeed present so that the click can be performed
    const nthElementToSelect = await $(`#suggestions div:nth-child(${resultIndex})`)
    expect(await nthElementToSelect.isExisting()).toBe(true)
    await nthElementToSelect.click()
  }

  async searchForAnAgreementHolderAndSelectFirst (searchTerm) {
    await this.searchForAnAgreementHolder(searchTerm)
    await this.selectResultFromSearchSuggestions()
  }
}
module.exports = new SearchPage()
