import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { getDownloadDetailsCsv } from "../backend/api";

module.exports = {
  method: 'GET',
  path: '/downloaddetails',
  handler: async (request: Request, h: ResponseToolkit) => {
    const {payeeName, partPostcode} = request.query
    try {
      const content = await getDownloadDetailsCsv(payeeName, partPostcode)
      return h.response(content)
        .type('application/csv')
        .header('Content-Disposition', 'attachment; filename=\"ffc-payment-details.csv\"')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}