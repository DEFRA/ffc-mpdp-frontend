const expectedList = [
  '/cookies',
  '/privacy',
  '/accessibility',
  'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs',
  'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/'
]

const expectFooter = $ => {
  const footerList = []
  $('.govuk-footer__link').each((_index, value) => {
    footerList.push($(value).attr('href'))
  })
  expect(
    expectedList.length === footerList.length &&
    expectedList.every(x => footerList.includes(x))
  ).toEqual(true)
}

module.exports = {
  expectFooter
}
