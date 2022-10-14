import * as cheerio from 'cheerio'

describe('MPDP Feedback test', () => {
  test('GET /feedback route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/feedback'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expect($('.govuk-heading-l').text()).toEqual(
      'Feedback survey to follow'
    )
  })
})
