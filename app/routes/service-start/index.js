const sharedConfig = {
  method: 'GET',
  options: {
    auth: false,
    handler: async (_, h) => {
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
