import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import config from '../config'
import * as utils from '../utils'

const urlcsv =  `${config.backendEndpoint}`+'/downloadall'

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request: Request, h: ResponseToolkit) => {
    try {
      const content = await utils.getBuffer(urlcsv)
      return h.response(content)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename=\"ffc-payment-data.csv\"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}