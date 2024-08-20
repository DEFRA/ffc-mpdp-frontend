const { getRelatedContentLinks } = require('../../config/relatedContent')

const sharedConfig = {
  method: 'GET',
  options: {
    auth: false,
    handler: (_request, h) => {
      return h.view('service-start/index', {
        relatedContentData: getRelatedContentLinks('service-start')
      })
    }
  }
}

module.exports = [{
  path: '/service-start',
  ...sharedConfig
}, {
  path: '/',
  ...sharedConfig
}
]
