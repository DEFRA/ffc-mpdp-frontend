const expectedList = require('../data/footer-list')
const toBePresent = ($) => {
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
  toBePresent
}
