import { Request, ResponseToolkit } from "@hapi/hapi";

import { getAllPaymentDataFilePath } from '../utils/helper'

module.exports = {
  method: 'GET',
  path: '/downloadalldata',
  handler: async (_request: Request, h: ResponseToolkit) => {
    try {
      return h.file(getAllPaymentDataFilePath(), {
        mode: 'attachment',
        filename: 'ffc-payment-data.csv'
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}