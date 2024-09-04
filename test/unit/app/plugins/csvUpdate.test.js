const config = require('../../../../app/config')
const csvUpdate = require('../../../../app/plugins/csvUpdate')
const fs = require('fs/promises')

jest.unmock('../../../../app/plugins/csvUpdate')

describe('csvUpdate plugin', () => {
  const originalFetch = global.fetch

  beforeAll(() => {
    jest.useFakeTimers()

    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('test data'),
        ok: true
      })
    )

    jest.spyOn(fs, 'writeFile').mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    global.fetch = originalFetch
    jest.useRealTimers()
  })

  it('should call fetchCSVFileData when initialised', async () => {
    await csvUpdate.register()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(`${config.backendEndpoint}/downloadall`)

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith('app/data/downloads/ffc-payment-data.csv', 'test data')
  })

  it('should call fetchCSVFileData again after a specified amount of time', () => {
    jest.advanceTimersByTime(config.csvFileUpdateInterval)

    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(fs.writeFile).toHaveBeenCalledTimes(2)
  })
})
