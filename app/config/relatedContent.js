const relatedContentLinks = [
  {
    id: 'fflmLink',
    text: 'Funding for farmers, growers and land managers',
    url: 'https://www.gov.uk/guidance/funding-for-farmers',
    pages: ['service-start', 'search', 'details', 'scheme-payments-by-year']
  },
  {
    id: 'ffCLink',
    text: 'Cookies',
    url: 'https://www.gov.uk/help/cookies',
    pages: ['privacy-policy']
  },
  {
    id: 'ffTCLink',
    text: 'Terms and conditions',
    url: 'https://www.gov.uk/help/terms-conditions',
    pages: ['privacy-policy', 'accessibility-policy']
  },
  {
    id: 'ffAGUKLink',
    text: 'About GOV.UK',
    url: 'https://www.gov.uk/help/about-govuk',
    pages: ['accessibility-policy']
  }
]

const getRelatedContentLinks = page => {
  return relatedContentLinks.filter(relatedContent =>
    relatedContent.pages.includes(page)
  )
}

module.exports = {
  relatedContentLinks,
  getRelatedContentLinks
}
