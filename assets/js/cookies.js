module.exports = {
  init () {
    this.setupCookieComponentListeners()
    this.setupLinkListeners()
  },

  setupLinkListeners () {
    const links = ['/cookies', '/privacy', '/accessibility']
    links.forEach((link) => {
      const element = document.querySelector(`a[href='${link}']`)
      element?.addEventListener('click', (event) => {
        if (window.location.pathname.includes(link)) {
          event.preventDefault()
        }
      })
    })
  },

  setupCookieComponentListeners () {
    const cookieContainer = document.querySelector('.js-cookies-container')
    if (!cookieContainer) { return }

    const acceptButton = document.querySelector('.js-cookies-button-accept')
    const rejectButton = document.querySelector('.js-cookies-button-reject')
    const acceptedBanner = document.querySelector('.js-cookies-accepted')
    const rejectedBanner = document.querySelector('.js-cookies-rejected')
    const cookieBanner = document.querySelector('.js-cookies-banner')

    const submitPreference = (accepted) => {
      const xhr = new XMLHttpRequest() // eslint-disable-line
      xhr.open('POST', '/cookies', true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify({
        analytics: accepted,
        async: true
      }))
    }

    const showBanner = (banner) => {
      const questionBanner = document.querySelector('.js-question-banner')
      questionBanner.setAttribute('hidden', 'hidden')
      banner.removeAttribute('hidden')
      // Shift focus to the banner
      banner.setAttribute('tabindex', '-1')
      banner.focus()

      banner.addEventListener('blur', () => {
        banner.removeAttribute('tabindex')
      })
    }

    cookieContainer.style.display = 'block'

    acceptButton?.addEventListener('click', (event) => {
      showBanner(acceptedBanner)
      event.preventDefault()
      submitPreference(true)
    })

    rejectButton?.addEventListener('click', (event) => {
      showBanner(rejectedBanner)
      event.preventDefault()
      submitPreference(false)
    })

    acceptedBanner?.querySelector('.js-hide').addEventListener('click', () => {
      cookieBanner.setAttribute('hidden', 'hidden')
    })

    rejectedBanner?.querySelector('.js-hide').addEventListener('click', () => {
      cookieBanner.setAttribute('hidden', 'hidden')
    })
  }
}
