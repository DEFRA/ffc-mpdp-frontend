const HomePage = require('../pageModels/home-page')
const SearchPage = require('../pageModels/search-page')
const { test, expect } = require('@playwright/test')

const baseUrl =
  process.env.BASE_URL ||
  'https://find-farm-and-land-payment-data.defra.gov.uk/'

test.describe('MPDP Service', () => {
  let homePage
  let searchPage

  test.beforeEach(async ({ page }) => {
    console.info('he baseUrl used is: ', baseUrl)

    homePage = new HomePage(page)
    searchPage = new SearchPage(page)

    await page.goto(baseUrl)
    await homePage.isLoaded()
    await homePage.acceptCookies()
  })

  test.afterEach(async () => {
    console.info('Tear down after each test')
  })

  test('Search for an agreement holder using location - JS version', async ({
    page
  }) => {
    await homePage.navigateToSearchPage()
    await searchPage.searchForAnAgreementHolderAndSelectFirst('Leeds')
    await expect(page.locator('#mpdpSummaryPanel')).toBeVisible({
      timeout: 5000
    })
  })

  test('Another acceptance test', async ({ page }) => {})
})
