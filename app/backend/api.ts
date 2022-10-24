const wreck = require('@hapi/wreck')
import config from '../config'

export const get = async (url: string) => {
  console.log(config.serviceName)
  const _url = `${config.backendEndpoint}${url}`
  console.log(`url: ${_url}`)
  return wreck.get(`${config.backendEndpoint}${url}`)
}
