const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')

Given('I navigate to MPDP Search page', { timeout: 10000 }, async function () {
  const baseUrl =
    process.env.BASE_URL ||
    this.baseURL ||
    'https://find-farm-and-land-payment-data.defra.gov.uk/'

  await this.page.goto(baseUrl)
  await this.homePage.isLoaded()
  await this.homePage.acceptCookies()
  await this.homePage.navigateToSearchPage()
})

Given(
  'I search for an agreement holder using a location',
  { timeout: 10000 },
  async function () {
    await this.searchPage.searchForAnAgreementHolder('Leeds')
  }
)

When('I select the first result from the search results', async function () {
  await this.searchPage.selectFirstFromSearchResults()
})

Then(
  'I should see summary details for the agreement holder',
  async function () {
    await expect(this.page.locator('#mpdpSummaryPanel')).toBeVisible({
      timeout: 5000
    })
  }
)
