type config = {
  env?: string,
  isDev?: boolean,
  port?: number,
  serviceName?: string,
}

export default {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'production',
  port: process.env.PORT? parseInt(process.env.PORT) : 3000,
  serviceName: 'Make Payment Data Public' 
} as config
