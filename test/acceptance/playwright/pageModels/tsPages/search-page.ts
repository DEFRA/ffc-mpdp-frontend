import { expect, type Locator, type Page } from '@playwright/test';

export class SearchPage {
  private readonly page: Page;
  private readonly searchTextInput: string;
  private readonly searchButton: Locator;
  private readonly totalResults: Locator;
  private readonly suggestionsDivSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchTextInput = '#searchInput';
    this.searchButton = this.page.locator("a[href='/search']");
    this.totalResults = this.page.locator('#totalResults');
    this.suggestionsDivSelector = this.page.locator('#suggestions div');
  }

  async search(searchTerm: string) {
    await this.page.fill(this.searchTextInput, searchTerm);
    await this.searchButton.click();
    await expect(this.totalResults).toBeVisible();
  }
  
  async searchForAnAgreementHolder(searchTerm: string) {
    await this.page.fill(this.searchTextInput, searchTerm);

    // Wait for the search suggestions to come back with some response
    await this.page.waitForResponse(
      (response) =>
        response.url().includes('/suggestions?searchString=') &&
        response.status() === 200
    );
  }

  async selectFirstFromSearchResults() {
    await this.suggestionsDivSelector.nth(2).waitFor({ timeout: 5000 });
    await this.suggestionsDivSelector.first().click();
  }

  async searchForAnAgreementHolderAndSelectFirst(searchTerm: string) {
    await this.searchForAnAgreementHolder(searchTerm);
    await this.selectFirstFromSearchResults();
  }
}
