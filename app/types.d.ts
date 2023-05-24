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
    financial_years: string[],
    total: string,
    startYear?: string,
    endYear?: string,
    schemes: Scheme[]
}

export type Scheme = {
  name: string,
  description: string,
  link: string,
  total: number,
  readableTotal: string,
  activity: ActivityDetail
}

export type ActivityDetail = {
  [financial_year: string]: {
    total: number,
    readableTotal?: string,
    schemeDetails: SchemeDetail[]
  }
}

export type SchemeDetail = {
  name: string,
  amount: string
}