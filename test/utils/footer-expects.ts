import { CheerioAPI } from "cheerio"

const expectedList = [
  '/accessibility',
  '/cookies',
  '/privacynotice',
  'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/'
]

export const expectFooter = ($: CheerioAPI) => {
  const footerList: (string | undefined)[] = []
  $('.govuk-footer__link').each((_index, value) => {
    footerList.push($(value).attr('href'))
  })
  expect(
    expectedList.length === footerList.length &&
    expectedList.every(x => footerList.includes(x))
  ).toEqual(true)
}
