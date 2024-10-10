const { expect } = require('@playwright/test')

class SearchPage {
  constructor (page) {
    this.page = page
    this.searchTextInput = '#searchInput'
    this.searchButton = this.page.locator("a[href='/search']")
    this.totalResults = this.page.locator('#totalResults')
    this.suggestionsDivSelector = this.page.locator('#suggestions div')
  }

  async search (searchTerm) {
    await this.page.fill(this.searchTextInput, searchTerm)
    await this.searchButton.click()
    await expect(this.totalResults).toBeVisible()
  }

  async searchForAnAgreementHolder (searchTerm) {
    await this.page.fill(this.searchTextInput, searchTerm)

    // Wait for the search suggestions to come back with some response
    await this.page.waitForResponse(
      (response) =>
        response.url().includes('/suggestions?searchString=') &&
        response.status() === 200
    )
  }

  async selectFirstFromSearchResults () {
    await this.suggestionsDivSelector.nth(2).waitFor({ timeout: 5000 })
    await this.suggestionsDivSelector.first().click()
  }

  async searchForAnAgreementHolderAndSelectFirst (searchTerm) {
    await this.searchForAnAgreementHolder(searchTerm)
    await this.selectFirstFromSearchResults()
  }
}
module.exports = SearchPage
