const config = require('../../app/config')

const expectedList = [
  'https://www.gov.uk/',
  '/service-start'
]

const expectHeaderElement = $ => {
  expect($('.govuk-header')).toBeDefined()
}

const expectLinks = $ => {
  const headerList = []
  $('.govuk-header__link').each((_index, value) => {
    headerList.push($(value).attr('href'))
  })
  expect(
    expectedList.length === headerList.length &&
    expectedList.every(x => headerList.includes(x))
  ).toEqual(true)
}

const expectTexts = $ => {
  expect($('.govuk-header__logo a title').text()).toContain('GOV.UK')

  expect($('a.govuk-header__service-name').first().text()).toContain(config.serviceName)
}

const expectHeader = $ => {
  expectHeaderElement($)
  expectLinks($)
  expectTexts($)
}

module.exports = {
  expectHeader
}
