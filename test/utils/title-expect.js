const config = require('../../app/config')
const { trimExtraSpaces } = require('./helpers')

const expectTitle = ($, pageTitle) => {
  const _pageTitle = pageTitle ? `${pageTitle} - ` : ''
  expect(trimExtraSpaces($('title').text())).toMatch(`${_pageTitle}${config.serviceName} - GOV.UK`)
}

module.exports = {
  expectTitle
}
