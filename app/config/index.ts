type config = {
  env: string,
  port: number,
  serviceName: string,
  startPageLink: string,
  backendEndpoint: string,
  search: {
    limit: number
  }
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT? parseInt(process.env.PORT) : 3001,
  serviceName: 'Find data on farm and land payments',
  startPageLink: '/service-start',
  backendEndpoint: process.env.MPDP_BACKEND_ENDPOINT,
  search: {
    limit: process.env.NODE_ENV === 'production'? 20 : 10
  }
} as config
