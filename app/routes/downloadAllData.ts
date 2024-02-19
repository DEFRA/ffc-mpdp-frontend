import { Request, ResponseToolkit } from "@hapi/hapi";
import fs from 'fs'

module.exports = {
  method: 'GET',
  path: '/allData',
  handler: async (_request: Request, h: ResponseToolkit) => {
    try {
      const stream = fs.createReadStream('../data/rawData/ffc-payment-data')
      return h.response(stream)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename=\"ffc-payment-data.csv\"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}