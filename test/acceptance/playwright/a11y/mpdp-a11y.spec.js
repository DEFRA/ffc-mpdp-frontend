const HomePage = require('../pageModels/home-page')
const SearchPage = require('../pageModels/search-page')
const { test, expect } = require('@playwright/test')
const { AxeBuilder } = require('@axe-core/playwright')

const baseUrl =
  process.env.BASE_URL ||
  'https://find-farm-and-land-payment-data.defra.gov.uk/'

test.describe(
  'Making Payment Data Public Service - Accessibility Tests',
  () => {
    let homePage
    let searchPage

    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page)
      searchPage = new SearchPage(page)

      await page.goto(baseUrl)
      await homePage.isLoaded()
      await homePage.acceptCookies()
    })

    test('Verify automatically detectable WCAG A or AA violations', async ({
      page
    }) => {
      const wcagAccessibilityTags = [
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa'
      ]
      const homePageA11yScanResults = await new AxeBuilder({ page })
        .withTags(wcagAccessibilityTags)
        .analyze()
      expect(homePageA11yScanResults.violations).toEqual([])

      await homePage.navigateToSearchPage()
      const searchPageA11yScanResults = await new AxeBuilder({ page })
        .withTags(wcagAccessibilityTags)
        .analyze()
      expect(searchPageA11yScanResults.violations).toEqual([])

      await searchPage.searchForAnAgreementHolderAndSelectFirst('Leeds')
      await expect(page.locator('#mpdpSummaryPanel')).toBeVisible({
        timeout: 5000
      })
      const summaryPageA11yScanResults = await new AxeBuilder({ page })
        .withTags(wcagAccessibilityTags)
        .analyze()
      expect(summaryPageA11yScanResults.violations).toEqual([])
    })
  }
)
