import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { schemePaymentsByYearModel } from "./models/schemePaymentsByYearModel";

module.exports = [
  {
    path: '/schemePaymentsByYear',
    method: 'GET',
    options: {
      auth: false,
      handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
        return h.view('scheme-payments-by-year/index', await schemePaymentsByYearModel());
      }
    }
  }
]
