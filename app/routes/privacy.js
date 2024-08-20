const { getRelatedContentLinks } = require('../config/relatedContent')

module.exports = {
  method: 'GET',
  path: '/privacy',
  handler: (request, h) => {
    return h.view('privacy/privacy-policy', {
      referer: request.headers.referer,
      relatedContentData: getRelatedContentLinks('privacy-policy')
    })
  }
}
