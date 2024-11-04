const { getRelatedContentLinks } = require('../config/related-content')

module.exports = {
  method: 'GET',
  path: '/accessibility',
  handler: (_request, h) => {
    return h.view('accessibility/accessibility-policy', {
      referer: _request.headers.referer,
      relatedContentData: getRelatedContentLinks('accessibility-policy')
    })
  }
}
