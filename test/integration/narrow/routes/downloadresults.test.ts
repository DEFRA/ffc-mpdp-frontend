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
      scheme: 'Sustainable Farming Incentive Pilot',
      total_amount: '2750.00'
    },
    {
      payee_name: 'John Rolfson',
      part_postcode: 'BH6',
      town: 'Bournemouth, Christchurch and Poole, unparished area',
      county_council: 'None',
      scheme: 'Sustainable Farming Incentive Pilot',
      total_amount: 22159
    },
    {
      payee_name: 'Mathew Johnston',
      part_postcode: 'WA14',
      town: 'Trafford, unparished area',
      county_council: 'None',
      scheme: 'Sustainable Farming Incentive Pilot',
      total_amount: 13285
    }],
    total: 3
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
    expect(res.result).toContain("payee_name\",\"part_postcode\",\"town\",\"county_council\",\"scheme\",\"amount")
    expect(res.result).toContain("Johnny Gibson\",\"B61\",\"Bromsgrove, unparished area\",\"Worcestershire\",\"Sustainable Farming Incentive Pilot\",\"2,750.00")
    expect(res.result).toContain("John Rolfson\",\"BH6\",\"Bournemouth, Christchurch and Poole, unparished area\",\"None\",\"Sustainable Farming Incentive Pilot\",\"22,159.00")
    expect(res.result).toContain("Mathew Johnston\",\"WA14\",\"Trafford, unparished area\",\"None\",\"Sustainable Farming Incentive Pilot\",\"13,285.00")
  })

  test('GET /downloadresults returns the expected content when filters selected', async () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3001/downloadresults?searchString=john&amounts=20000-24999&sortBy=score'
    }
    const res = await global.__SERVER__.inject(request)
    expect(res.result).toContain("payee_name\",\"part_postcode\",\"town\",\"county_council\",\"scheme\",\"amount")
    expect(res.result).toContain("John Rolfson\",\"BH6\",\"Bournemouth, Christchurch and Poole, unparished area\",\"None\",\"Sustainable Farming Incentive Pilot\",\"22,159.00")
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