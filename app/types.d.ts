export type queryParams = {
    payeeName: string,
    partPostcode: string,
    searchString: string, 
    page: string 
  }
  
export type Summary = {
    payee_name: string,
    part_postcode: string,
    town: string,
    county_council: string,
    parliamentary_constituency: string,
    financial_year: string,
    total: string,
    startYear?: string,
    endYear?: string,
    schemes: [{
      name: string,
      description: string,
      link: string,
      total?: string,
      schemeTypes: [{
        name: string,
        amount?: string
      }]
    }] | any[]
}

export type Scheme = {
  name: string,
  description: string,
  link: string,
  total: string,
  schemeTypes: SchemeDetail[]
}

export type SchemeDetail = {
  name: string,
  amount: string,
}