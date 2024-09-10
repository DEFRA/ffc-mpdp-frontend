const config = require('../../../../app/config')
const fs = require('fs/promises')

const originalFetch = global.fetch

describe.skip('csvUpdate plugin', () => {
  beforeAll(async () => {
    jest.unmock('../../../../app/plugins/csvUpdate')
    jest.useFakeTimers()

    jest.spyOn(fs, 'writeFile').mockImplementation(() => Promise.resolve())
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      text: () => Promise.resolve('test data'),
      ok: true
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(async () => {
    global.fetch = originalFetch
    jest.useRealTimers()
  })

  it('should call fetchCSVFileData when initialised', async () => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${config.backendEndpoint}/downloadall`)

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith('app/data/downloads/ffc-payment-data.csv', 'test data')
  })

  it('should call fetchCSVFileData again after a specified amount of time', () => {
    jest.advanceTimersByTime(config.csvFileUpdateInterval)

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
  })

  describe('fetch error', () => {
    beforeAll(() => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ ok: false }))
    })

    it('should throw an error if theres a problem fetching the data', async () => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(fs.writeFile).toHaveBeenCalledTimes(0)
    })
  })
})
