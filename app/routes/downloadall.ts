import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { get } from '../backend/api'
import config from '../config'

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: {
    proxy: {
      host: `${config.backendEndpoint}`,
      port: 80,
      protocol: "http",
      passThrough: true,
      xforward: true,
    },
  }
}
