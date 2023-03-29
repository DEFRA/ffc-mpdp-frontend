import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import config from '../config'
import * as utils from '../utils'

module.exports = {
  method: 'GET',
  path: '/downloaddetails',
  handler: async (_request: Request, h: ResponseToolkit) => {
    const {payeeName, partPostcode} = _request.query
    const urlcsv =  `${config.backendEndpoint}`+'/downloaddetails'
      + '?payeeName=' +payeeName + '&partPostcode=' + partPostcode
    console.log(urlcsv)
    try {
      const content = await utils.getBuffer(urlcsv)
      return h.response(content)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename=\"ffc-payment-data-details.csv\"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}