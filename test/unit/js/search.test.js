const search = require('../../../assets/js/search')
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
      <input type="text" id="searchInput" />
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
    it('should resolve with parsed JSON data if the request is successful', async () => {
      const mockResponse = { data: 'test' }
      const spySearchSuggestions = jest.spyOn(search, 'getSearchSuggestions')
      spySearchSuggestions.mockImplementationOnce(() =>
        Promise.resolve(mockResponse)
      )

      const result = await search.getSearchSuggestions('query')
      expect(spySearchSuggestions).toHaveBeenCalled()
      expect(result).toEqual(mockResponse)
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
  })

  describe('addSearchInputListeners', () => {
    it('should hide suggestions when input length is less than minCharLength', () => {
      searchInput.value = 'te'
      const spy = jest.spyOn(search, 'hideSuggestions')
      searchInput.dispatchEvent(new window.Event('input', { bubbles: true }))

      expect(spy).toHaveBeenCalled()
    })

    it('should call loadSuggestions when input length is sufficient', () => {
      searchInput.value = 'test'
      const spy = jest.spyOn(search, 'loadSuggestions')
      searchInput.dispatchEvent(new window.Event('input'))

      expect(spy).toHaveBeenCalled()
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
      const spy = jest.spyOn(search, 'hideSuggestions')
      const escapeEvent = new window.KeyboardEvent('keydown', { key: 'Escape' })

      searchInput.dispatchEvent(escapeEvent)
      expect(spy).toHaveBeenCalled()
    })

    it('should trigger search button click on Enter key press', () => {
      const spy = jest.spyOn(document.getElementById('searchButton'), 'click')
      const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter' })

      searchInput.dispatchEvent(enterEvent)
      expect(spy).toHaveBeenCalled()
    })
  })
})
