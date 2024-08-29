const cookies = require('../../../../assets/js/cookies')
const { JSDOM } = require('jsdom')
const dom = new JSDOM()

describe('MyModule', () => {
  beforeAll(() => {
    global.document = dom.window.document
    global.window = dom.window
  })

  beforeEach(() => {
    document.body.innerHTML = `
            <div class="js-cookies-container" style="display:none;">
                <button class="js-cookies-button-accept">Accept</button>
                <button class="js-cookies-button-reject">Reject</button>
                <div class="js-cookies-accepted" hidden>
                    <button class="js-hide">Hide</button>
                </div>
                <div class="js-cookies-rejected" hidden>
                    <button class="js-hide">Hide</button>
                </div>
                <div class="js-cookies-banner"></div>
                <div class="js-question-banner"></div>
            </div>
            <a href="/cookies">Cookies</a>
            <a href="/privacy">Privacy</a>
            <a href="/accessibility">Accessibility</a>
        `
    cookies.init()
  })

  describe('init', () => {
    it('should initialize and set up listeners', () => {
      expect(document.querySelector('.js-cookies-container').style.display).toBe('block')
    })
  })

  describe('setupLinkListeners', () => {
    it('should prevent default if the link is already active', () => {
      dom.reconfigure({ url: 'http://localhost/cookies' })

      const cookiesLink = document.querySelector("a[href='/cookies']")
      const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefault = jest.spyOn(event, 'preventDefault')

      cookiesLink.dispatchEvent(event)
      expect(preventDefault).toHaveBeenCalled()
    })

    it('should not prevent default if the link is not active', () => {
      dom.reconfigure({ url: 'http://localhost/different-path' })

      const cookiesLink = document.querySelector("a[href='/cookies']")
      const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefault = jest.spyOn(event, 'preventDefault')

      cookiesLink.dispatchEvent(event)
      expect(preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('setupCookieComponentListeners', () => {
    let xhrMock

    beforeEach(() => {
      xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn()
      }
      global.XMLHttpRequest = jest.fn(() => xhrMock)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should display cookie container', () => {
      expect(document.querySelector('.js-cookies-container').style.display).toBe('block')
    })

    it('should show accepted banner and send correct data on accept', () => {
      const acceptButton = document.querySelector('.js-cookies-button-accept')
      const acceptedBanner = document.querySelector('.js-cookies-accepted')
      const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefault = jest.spyOn(event, 'preventDefault')
      const focusSpy = jest.spyOn(acceptedBanner, 'focus')

      acceptButton.dispatchEvent(event)

      expect(preventDefault).toHaveBeenCalled()
      expect(acceptedBanner.hasAttribute('hidden')).toBe(false)
      expect(focusSpy).toHaveBeenCalled()
      expect(xhrMock.open).toHaveBeenCalledWith('POST', '/cookies', true)
      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(xhrMock.send).toHaveBeenCalledWith(JSON.stringify({ analytics: true, async: true }))
    })

    it('should show rejected banner and send correct data on reject', () => {
      const rejectButton = document.querySelector('.js-cookies-button-reject')
      const rejectedBanner = document.querySelector('.js-cookies-rejected')
      const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefault = jest.spyOn(event, 'preventDefault')
      const focusSpy = jest.spyOn(rejectedBanner, 'focus')

      rejectButton.dispatchEvent(event)

      expect(preventDefault).toHaveBeenCalled()
      expect(rejectedBanner.hasAttribute('hidden')).toBe(false)
      expect(focusSpy).toHaveBeenCalled()
      expect(xhrMock.open).toHaveBeenCalledWith('POST', '/cookies', true)
      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(xhrMock.send).toHaveBeenCalledWith(JSON.stringify({ analytics: false, async: true }))
    })

    it('should hide cookie banner when hide button is clicked on accepted banner', () => {
      const acceptedBannerHideButton = document.querySelector('.js-cookies-accepted .js-hide')
      const cookieBanner = document.querySelector('.js-cookies-banner')

      acceptedBannerHideButton.click()

      expect(cookieBanner.hasAttribute('hidden')).toBe(true)
    })

    it('should hide cookie banner when hide button is clicked on rejected banner', () => {
      const rejectedBannerHideButton = document.querySelector('.js-cookies-rejected .js-hide')
      const cookieBanner = document.querySelector('.js-cookies-banner')

      rejectedBannerHideButton.click()

      expect(cookieBanner.hasAttribute('hidden')).toBe(true)
    })
  })
})
