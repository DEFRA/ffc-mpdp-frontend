const { $ } = require('@wdio/globals')
const Page = require('./page.js')

class HomePage extends Page {
  get acceptCookieButton () {
    return $('.js-cookies-button-accept')
  }

  get hideCookieMessageButton () {
    return $('.js-cookies-accepted .js-hide')
  }

  get startNowButton () {
    return $('a[href="/search"]')
  }

  open () {
    return super.open()
  }

  async goto () {
    await this.page.goto('./')
  }

  async acceptCookies () {
    await this.acceptCookieButton.click()
    await this.hideCookieMessageButton.click()
  }

  async isLoaded () {
    await expect(this.acceptCookieButton).toBeDisplayed()
    await expect(await browser.getTitle()).toContain('Find farm and land payment data - GOV.UK')
  }

  async navigateToSearchPage () {
    await this.startNowButton.click()
    console.log('I am in the navigateToSearchPage', await browser.getUrl())
    await expect(await browser.getUrl()).toContain('search')
  }
}
module.exports = new HomePage()
