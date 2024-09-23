// import { browser } from '@wdio/globals'
const { browser } = require('@wdio/globals')

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open () {
    return browser.url('./')
  }

  async waitForResponse (apiEndpoint) {
    await browser.waitUntil(
      async () => {
        const requests = await browser.getRequests()
        const specificRequest = requests.find(
          (req) =>
            req.url.includes(apiEndpoint) && req.response.statusCode === 200
        )
        return specificRequest !== undefined
      },
      {
        timeout: 10000,
        timeoutMsg: 'Expected network request did not occur within the timeout'
      }
    )
  }

  async waitForNthElement (selector) {
    await browser.waitUntil(
      async () => {
        const nthElementExists = await $(selector).isExisting()
        return nthElementExists
      },
      {
        timeout: 5000,
        timeoutMsg:
          'The nth element did not appear in the list within the timeout'
      }
    )
  }
}
module.exports = Page
