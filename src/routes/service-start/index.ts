import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

const sharedConfig = {
  method: 'GET',
  options: {
    auth: false,
    handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
      return h.view('service-start/index')
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
