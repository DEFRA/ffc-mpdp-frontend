type config = {
  env: string,
  port: number,
  serviceName: string,
  startPageLink: string,
  backendEndpoint: string,
  search: {
    limit: number
  },
  routes: {
    [key: string]: {
      title: string
    }
  }
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT? parseInt(process.env.PORT) : 3001,
  serviceName: 'Find data on farm and land payments',
  startPageLink: '/service-start',
  backendEndpoint: process.env.MPDP_BACKEND_ENDPOINT,
  search: {
    limit: 20
  },
  routes: {
    '/': {
      title: 'Find data on farm and land payments'
    },
    '/service-start': {
      title: 'Find data on farm and land payments'
    },
    '/search': {
      title: 'Search for a business or agreement holder'
    },
    '/results': {
      title: 'Search for a business or agreement holder'
    }
  }
} as config
