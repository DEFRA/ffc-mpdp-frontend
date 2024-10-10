const { expect } = require('@playwright/test')

class HomePage {
  constructor (page) {
    this.page = page
    this.acceptCookieButton = this.page.locator("[value='accept']")
    this.hideCookieMessageButton = this.page
      .getByText('Hide this message')
      .first()
    this.startNowButton = this.page.locator("a[href='/search']")
  }

  async goto () {
    await this.page.goto('./')
  }

  async acceptCookies () {
    await this.acceptCookieButton.click()
    await this.hideCookieMessageButton.click()
  }

  async isLoaded () {
    await expect(this.acceptCookieButton).toBeVisible()
    await expect(this.page).toHaveTitle(
      /Find farm and land payment data - GOV.UK/
    )
  }

  async navigateToSearchPage () {
    await this.startNowButton.click()
    expect(this.page.url()).toContain('/search')
    await expect(this.page.locator('#searchInput')).toBeVisible()
  }
}
module.exports = HomePage
