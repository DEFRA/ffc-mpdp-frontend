import { CheerioAPI } from "cheerio"
import config from '../../app/config'

const expectedList = [
  'https://www.gov.uk/',
  '/service-start'
]

const expectHeaderElement = ($:CheerioAPI) => {
  expect($('.govuk-header')).toBeDefined()
}

const expectLinks = ($: CheerioAPI) => {
  const headerList: (string | undefined)[] = []
  $('.govuk-header__link').each((_index, value) => {
    headerList.push($(value).attr('href'))
  })
  expect(
    expectedList.length === headerList.length &&
    expectedList.every(x => headerList.includes(x))
  ).toEqual(true)
}

const expectTexts = ($: CheerioAPI) => {
  expect($('.govuk-header__logotype-text').text()).toContain(
    'GOV.UK'
  )
  
  expect($('a.govuk-header__service-name').first().text()).toContain(
    config.serviceName
  )
}

export const expectHeader = ($: CheerioAPI) => {
  expectHeaderElement($)
  expectLinks($)
  expectTexts($)
}
