import config from '../config'
import { getPageTitle } from '../utils/helper'

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server: any, _: any) => {
      server.ext('onPreResponse', function (request: any, h: any) {
        const response = request.response
        
        if (response.variety === 'view') {
          const ctx = response.source.context || {}
          ctx.serviceName = config.serviceName
          ctx.serviceUrl = config.startPageLink
          
          const { path } = request

          ctx.pageTitle = getPageTitle(path)
          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
