type config = {
  env: string,
  port: number,
  serviceName: string,
  startPageLink: string,
  feedbackLink: string,
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
  feedbackLink: process.env.feedbackLink,
  backendEndpoint: process.env.MPDP_BACKEND_ENDPOINT,
  search: {
    limit: 10
  }
} as config
