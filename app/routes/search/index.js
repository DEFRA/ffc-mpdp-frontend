const { getRelatedContentLinks } = require('../../config/relatedContent')

module.exports = [
  {
    path: '/search',
    method: 'GET',
    options: {
      auth: false,
      handler: (request, h) => {
        return h.view('search/index', {
          referer: request.headers.referer,
          relatedContentData: getRelatedContentLinks('search')
        })
      }
    }
  }
]
