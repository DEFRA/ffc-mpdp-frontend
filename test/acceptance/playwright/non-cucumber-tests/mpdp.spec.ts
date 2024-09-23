import { test, expect } from "@playwright/test";
import { HomePage } from "../pageModels/tsPages/home-page";
import { SearchPage } from "../pageModels/tsPages/search-page";

const baseUrl =
  process.env.BASE_URL ||
  "https://find-farm-and-land-payment-data.defra.gov.uk/";

test.describe("Making Payment Data Public Services", () => {
  let homePage: HomePage;
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchPage = new SearchPage(page);
    await page.goto(baseUrl);
    await homePage.isLoaded();
    await homePage.acceptCookies();
  });

  test.afterEach(async () => {
    console.info("Tear down after each test");
  });

  test("Search for an agreement holder using location - TS version", async ({
    page,
    browserName,
  }) => {
    await homePage.navigateToSearchPage();
    await searchPage.searchForAnAgreementHolderAndSelectFirst("Leeds");
    await expect(page.locator("#mpdpSummaryPanel")).toBeVisible({
      timeout: 5000,
    });
  });
});
