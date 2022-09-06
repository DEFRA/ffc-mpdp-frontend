const errors = ($, expectedMessage) => {
  expect($('.govuk-form-group--error').length).toEqual(1)
  expect($('.govuk-error-message').length).toEqual(1)
  expect($('.govuk-error-message').eq(0).text()).toMatch(expectedMessage)
}

module.exports = {
  errors
}
