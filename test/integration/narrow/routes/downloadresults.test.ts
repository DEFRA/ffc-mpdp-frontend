import * as api from '../../../../app/backend/api'

afterEach(() => {
  jest.clearAllMocks();
});

describe('downloadresults csv test', () => {
  const content = {
    results: [{
      payee_name: 'Johnny Gibson',
      part_postcode: 'B61',
      town: 'Bromsgrove, unparished area',
      county_council: 'Worcestershire',
      year: '21/22',
      total_amount: '2750.00',
      scheme: 'Farming Investment Fund'
    },
    {
      payee_name: 'John Rolfson',
      part_postcode: 'BH6',
      town: 'Bournemouth, Christchurch and Poole, unparished area',
      county_council: 'None',
      year: '21/22',
      total_amount: 22159,
      scheme: 'Farming Investment Fund'
    },
    {
      payee_name: 'Mathew Johnston',
      part_postcode: 'WA14',
      town: 'Trafford, unparished area',
      county_council: 'None',
      year: '22/23',
      total_amount: 13285,
      scheme: 'Farming Resilience Fund'
    }],
    total: 3,
    filterOptions: { schemes: [], years: [], counties: [] }
  }

  const mockedFetch = jest.spyOn(api, 'getPaymentData')
  mockedFetch.mockResolvedValue(content)
  const request = {
    method: 'GET',
    url: 'http://localhost:3001/downloadresults?searchString=john&sortBy=score'
  }

  test('GET /downloadresults returns 200', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(200)
  })

  test('GET /downloadresults returns attachment', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.headers).toHaveProperty('content-type', 'application/csv')
    expect(res.headers).toHaveProperty('content-disposition', 'attachment; filename="ffc-payment-results.csv"')
  })

  test('GET /downloadresults returns the expected content', async () => {
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toContain("payee_name\",\"part_postcode\",\"town\",\"county_council\",\"amount")
    expect(res.result).toContain("Johnny Gibson\",\"B61\",\"Bromsgrove, unparished area\",\"Worcestershire\",\"2,750.00")
    expect(res.result).toContain("John Rolfson\",\"BH6\",\"Bournemouth, Christchurch and Poole, unparished area\",\"None\",\"22,159.00")
    expect(res.result).toContain("Mathew Johnston\",\"WA14\",\"Trafford, unparished area\",\"None\",\"13,285.00")
  })

  test('GET /downloadresults returns the expected content when filters selected', async () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3001/downloadresults?searchString=john&amounts=20000-24999&sortBy=score'
    }
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toContain("payee_name\",\"part_postcode\",\"town\",\"county_council\",\"amount")
    expect(res.result).toContain("John Rolfson\",\"BH6\",\"Bournemouth, Christchurch and Poole, unparished area\",\"None\",\"22,159.00")
  })

  test('GET /downloadresults returns the expected content when years filters selected', async () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3001/downloadresults?searchString=john&years=22/23&sortBy=score'
    }
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toContain("payee_name\",\"part_postcode\",\"town\",\"county_council\",\"amount")
    expect(res.result).toContain("Mathew Johnston\",\"WA14\",\"Trafford, unparished area\",\"None\",\"13,285.00")
  })

})


describe('downloadresults csv error test', () => {
  const request = {
    method: 'GET',
    url: 'http://localhost:3001/downloadresults?searchString=john&sortBy=score'
  }
  const mockedFetch = jest.spyOn(api, 'getPaymentData')

  test('GET /downloadresults throws error when underlying error', async () => {
    mockedFetch.mockRejectedValue('Internal Server Error')
    const res = await global.__SERVER__.inject(request)
    expect(res.statusCode).toBe(500)
  })

})