import { Request, ResponseToolkit } from "@hapi/hapi";
import { get } from "../backend/api";

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request: Request, h: ResponseToolkit) => {
    try {
      const content: any = await get('/downloadall')
      return h.response(content?.payload)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename=\"ffc-payment-data.csv\"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}