const { Given, When, Then } = require('@cucumber/cucumber')
const HomePage = require('../pageObjects/home.page.js')
const SearchPage = require('../pageObjects/search.page.js')
const SummaryPage = require('../pageObjects/summary.page.js')

const pages = {
  homePage: HomePage
}

Given('I navigate to MPDP Search page', { timeout: 10000 }, async function () {
  await pages.homePage.open()
  await HomePage.isLoaded()
  await HomePage.acceptCookies()
  await HomePage.navigateToSearchPage()
  await SearchPage.isLoaded()
})

When('I search for an agreement holder using a location', async () => {
  await SearchPage.searchForAnAgreementHolder('Leeds')
})

When('I select the first result from the search results', async () => {
  await SearchPage.selectResultFromSearchSuggestions(1)
})

Then('I should see summary details for the agreement holder', async () => {
  await SummaryPage.isLoaded()
})
