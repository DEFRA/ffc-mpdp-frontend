const search = require('../../../../assets/js/search')
const { JSDOM } = require('jsdom')
const dom = new JSDOM()

describe('search', () => {
  let searchInput
  let domSuggestions

  beforeAll(() => {
    global.document = dom.window.document
    global.window = dom.window
  })

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="searchInput" tabIndex="1" />
      <div id="suggestions"></div>
      <button id="searchButton">Search</button>
    `
    search.init()
    searchInput = document.getElementById('searchInput')
    domSuggestions = document.getElementById('suggestions')
  })

  describe('constructor', () => {
    it('should initialize with the correct default values', () => {
      expect(search.loadingText).toBe('Loading...')
      expect(search.noResultsText).toBe('No results found')
    })

    it('should call setupSearch and set up the searchInput and domSuggestions', () => {
      expect(search.searchInput).toBe(searchInput)
      expect(search.domSuggestions).toBe(domSuggestions)
    })

    it('should not proceed with the rest of the constructor if searchInput or domSuggestions is missing', () => {
      document.body.innerHTML = '<input type="text" id="someOtherInput" />'
      search.init()

      expect(search.searchInput).toBeNull()
      expect(search.domSuggestions).toBeNull()
    })
  })

  describe('getSearchSuggestions', () => {
    it('should resolve with search suggestions when successful', async () => {
      const mockMakeSearchRequest = jest.spyOn(search, 'makeSearchRequest').mockImplementationOnce((searchString, callback) => {
        callback(null, { suggestions: ['suggestion1', 'suggestion2'] })
      })

      const result = await search.getSearchSuggestions(encodeURIComponent('test'))

      expect(result).toEqual({ suggestions: ['suggestion1', 'suggestion2'] })
      expect(mockMakeSearchRequest).toHaveBeenCalledWith('test', expect.any(Function))
    })

    it('should reject with an error when unsuccessful', async () => {
      const mockMakeSearchRequest = jest.spyOn(search, 'makeSearchRequest').mockImplementationOnce((searchString, callback) => {
        callback(new Error({
          status: 500,
          statusText: 'Search request failed'
        }))
      })

      await expect(search.getSearchSuggestions(encodeURIComponent('test'))).rejects.toThrow(Error({
        status: 500,
        statusText: 'Search request failed'
      }))
      expect(mockMakeSearchRequest).toHaveBeenCalledWith('test', expect.any(Function))
    })
  })

  describe('makeSearchRequest', () => {
    it('should call XMLHttpRequest with correct parameters', async () => {
      const xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn()
      }

      jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock)

      const searchString = encodeURIComponent('test')
      const callback = jest.fn()

      search.makeSearchRequest(searchString, callback)
      expect(xhrMock.open).toHaveBeenCalledWith('GET', `/suggestions?searchString=${searchString}`, true)
      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(xhrMock.send).toHaveBeenCalledWith(JSON.stringify({
        searchString
      }))
    })

    it('should callback successfully with correct parameters', async () => {
      const response = {
        rows: [
          {
            payee_name: 'test',
            town: 'test',
            county_council: 'test',
            part_postcode: 'test'
          }
        ]
      }

      const xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(function () { this.onload() }),
        status: 200,
        response: JSON.stringify(response)
      }

      jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock)

      const searchString = encodeURIComponent('test')
      const callback = jest.fn()

      search.makeSearchRequest(searchString, callback)
      expect(callback).toHaveBeenCalledWith(null, response)
    })

    it('should callback with an error with error code after loading', async () => {
      const xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(function () { this.onload() }),
        status: 500,
        statusText: 'error'
      }

      jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock)

      const searchString = encodeURIComponent('test')
      const callback = jest.fn()

      search.makeSearchRequest(searchString, callback)
      expect(callback).toHaveBeenCalledWith(new Error({ status: 500, statusText: 'error' }))
    })

    it('should callback with an error with error code if there was an error', async () => {
      const xhrMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(function () { this.onerror() }),
        status: 500,
        statusText: 'error'
      }

      jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock)

      const searchString = encodeURIComponent('test')
      const callback = jest.fn()

      search.makeSearchRequest(searchString, callback)
      expect(callback).toHaveBeenCalledWith(new Error({ status: 500, statusText: 'error' }))
    })
  })

  describe('getOption', () => {
    it('should create a div with specified properties', () => {
      const mockClick = jest.fn()
      const mockMouseOver = jest.fn()
      const option = search.getOption(
        'value',
        'text',
        mockClick,
        mockMouseOver,
        'test-class'
      )

      expect(option.value).toBe('value')
      expect(option.textContent).toBe('text')
      expect(option.classList.contains('test-class')).toBe(true)
      option.onmousedown()
      option.onmouseover()
      expect(mockClick).toHaveBeenCalled()
      expect(mockMouseOver).toHaveBeenCalled()
    })

    it('should handle optional parameters', () => {
      const option = search.getOption('value', 'text', jest.fn())
      expect(option.onmouseover).toBe(null)
      expect(option.classList.length).toBe(0)
    })
  })

  describe('loadingOption', () => {
    it('should return a DIV with the expect text and value', () => {
      const loadingOption = search.loadingOption()
      expect(loadingOption.value).toBe(search.loadingText)
    })
  })

  describe('noResultsOption', () => {
    it('should return a DIV with the expect text and value', () => {
      const noResultsOption = search.noResultsOption()
      expect(noResultsOption.value).toBe(search.noResultsText)
    })
  })

  describe('viewAllOption', () => {
    it('should create a view all option with correct text', () => {
      const numResults = 5

      const option = search.viewAllOption(numResults)
      expect(option.textContent).toBe(`View all (${numResults} results)`)
      expect(option.classList.contains('mpdp-text-align-center')).toBe(true)
    })

    it('should correctly handle singular result', () => {
      const option = search.viewAllOption(1)
      expect(option.textContent).toBe('View all (1 result)')
    })
  })

  describe('hideSuggestions', () => {
    it('should hide the suggestions and reset focusIndex', () => {
      search.hideSuggestions()
      expect(domSuggestions.style.display).toBe('none')
      expect(search.focusIndex).toBe(-1)
    })
  })

  describe('showSuggestions', () => {
    it('should display the suggestions', () => {
      search.showSuggestions()
      expect(domSuggestions.style.display).toBe('block')
    })
  })

  describe('loadSuggestions', () => {
    it('should display suggestions if results are found', async () => {
      const mockSuggestions = {
        count: 2,
        rows: [
          {
            payee_name: 'Payee 1',
            town: 'Town1',
            county_council: 'Council1',
            part_postcode: 'P1'
          },
          {
            payee_name: 'Payee 2',
            town: 'Town2',
            county_council: 'Council2',
            part_postcode: 'P2'
          }
        ]
      }
      search.getSearchSuggestions = jest
        .fn()
        .mockResolvedValueOnce(mockSuggestions)

      await search.loadSuggestions()

      expect(domSuggestions.innerHTML).toContain(
        'Payee 1 (Town1, Council1, P1)'
      )
      expect(domSuggestions.innerHTML).toContain(
        'Payee 2 (Town2, Council2, P2)'
      )
    })
  })

  describe('setActive and unsetActive', () => {
    beforeEach(() => {
      domSuggestions.innerHTML = `
        <div value="1" class="option">Option 1</div>
        <div value="2" class="option">Option 2</div>
      `
    })

    it('should set the active class on the focused option', () => {
      search.focusIndex = 1
      search.setActive()

      expect(domSuggestions.children[1].classList).toContain('active')
    })

    it('should unset the active class on all options', () => {
      domSuggestions.children[1].classList.add('active')
      search.unsetActive()

      for (const child of domSuggestions.children) {
        expect(child.classList).not.toContain('active')
      }
    })

    it('should set the focusIndex to 1 if it goes below 0', () => {
      search.focusIndex = -1
      search.setActive()
      expect(search.focusIndex).toBe(1)
    })

    it('should set the focusIndex to 0 if it goes above the number of DOM children', () => {
      search.focusIndex = 2
      search.setActive()
      expect(search.focusIndex).toBe(0)
    })

    it('should return without making any children active if the current child has loading text', () => {
      domSuggestions.innerHTML = `
        <div class="mpdp-text-color-dark-grey" value="${search.loadingText}">${search.loadingText}</div>
      `
      search.focusIndex = 0
      search.setActive()

      for (const child of domSuggestions.children) {
        expect(child.classList).not.toContain('active')
      }
    })

    it('should return without making any children active if the current child has no results text', () => {
      domSuggestions.innerHTML = `
        <div class="mpdp-text-color-dark-grey" value="${search.noResultsText}">${search.noResultsText}</div>
      `
      search.focusIndex = 0
      search.setActive()

      for (const child of domSuggestions.children) {
        expect(child.classList).not.toContain('active')
      }
    })
  })

  describe('addSearchInputListeners', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should hide suggestions when the search input is blurred', () => {
      const hideSuggestionsSpy = jest.spyOn(search, 'hideSuggestions')
      const timeoutSpy = jest.spyOn(window, 'setTimeout')
      searchInput.dispatchEvent(new window.Event('blur', { bubbles: true }))

      expect(timeoutSpy).toHaveBeenCalled()

      jest.runAllTimers()

      expect(hideSuggestionsSpy).toHaveBeenCalled()
    })

    it('should hide suggestions when input length is less than minCharLength', () => {
      searchInput.value = 'te'
      const hideSuggestionsSpy = jest.spyOn(search, 'hideSuggestions')
      searchInput.dispatchEvent(new window.Event('input', { bubbles: true }))

      expect(hideSuggestionsSpy).toHaveBeenCalled()
    })

    it('should call loadSuggestions when input length is sufficient', () => {
      searchInput.value = 'test'
      const loadSuggestionsSpy = jest.spyOn(search, 'loadSuggestions')
      searchInput.dispatchEvent(new window.Event('input'))

      expect(loadSuggestionsSpy).toHaveBeenCalled()
    })

    it('should navigate through options on arrow key presses', () => {
      domSuggestions.innerHTML = `
                <div value="1" class="option">Option 1</div>
                <div value="2" class="option">Option 2</div>
            `
      const downEvent = new window.KeyboardEvent('keydown', { key: 'Down' })
      const upEvent = new window.KeyboardEvent('keydown', { key: 'Up' })

      searchInput.dispatchEvent(downEvent)
      expect(search.focusIndex).toBe(0)

      searchInput.dispatchEvent(upEvent)
      expect(search.focusIndex).toBe(1)
    })

    it('should hide suggestions on Escape key press', () => {
      const hideSuggestionsSpy = jest.spyOn(search, 'hideSuggestions')
      const escapeEvent = new window.KeyboardEvent('keydown', { key: 'Escape' })

      searchInput.dispatchEvent(escapeEvent)
      expect(hideSuggestionsSpy).toHaveBeenCalled()
    })

    it('should trigger search button click on Enter key press', () => {
      const spy = jest.spyOn(document.getElementById('searchButton'), 'click')
      const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' })

      searchInput.dispatchEvent(enterEvent)
      expect(spy).toHaveBeenCalled()
    })

    it('should do nothing if the the option has Loading text', () => {
      domSuggestions.innerHTML = `
        <div class="mpdp-text-color-dark-grey" value="test">${search.loadingText}</div>
      `
      search.focusIndex = 0
      const spy = jest.spyOn(domSuggestions.children[0], 'click')
      const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' })

      searchInput.dispatchEvent(enterEvent)
      expect(spy).not.toHaveBeenCalled()
    })
  })
})
