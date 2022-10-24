type config = {
  env: string,
  isDev: boolean,
  port: number,
  serviceName: string,
  startPageLink: string,
  feedbackLink: string,
  backendEndpoint: string,
}

export default {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'production',
  port: process.env.PORT? parseInt(process.env.PORT) : 3001,
  serviceName: 'Find data on farm and land payments',
  startPageLink: '/service-start',
  feedbackLink: process.env.feedbackLink,
  backendEndpoint: process.env.MPDP_BACKEND_ENDPOINT || 'http://localhost:3000',
} as config
