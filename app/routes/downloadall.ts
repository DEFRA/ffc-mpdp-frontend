import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

const csvFile = 'app/data/mpdp-data-file.csv'
module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: (_request: Request, h: ResponseToolkit) => {
    return h.file(csvFile).header('mode', 'attachment').type('text/csv')
  }
}