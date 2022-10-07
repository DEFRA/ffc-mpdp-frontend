type config = {
  env?: string,
  isDev?: boolean,
  port?: number,
  serviceName?: string,
  startPageLink: string,
  feedbackLink?: string,
}

export default {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'production',
  port: process.env.PORT? parseInt(process.env.PORT) : 3001,
  serviceName: 'Find data on farm and land payments',
  startPageLink: '/service-start',
  feedbackLink: process.env.feedbackLink
} as config
