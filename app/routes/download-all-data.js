const { Readable } = require('stream')
const { getDownloadAllCsv } = require('../backend/api')
const { getAllPaymentDataFilePath } = require('../utils/helper')

/* Checkout this confluence page to find out the rationale behind this functionality
 / https://eaflood.atlassian.net/wiki/spaces/MAKING/pages/4721999958/Download+all+data+functionality+overview
*/
module.exports = {
  method: 'GET',
  path: '/downloadalldata',
  handler: async (_request, h) => {
    const csvStream = await getDownloadAllCsv()

    return h.response(csvStream)
      .type('text/csv')
      .header('Content-Disposition', 'attachment; filename="ffc-payment-data.csv"')
    // return h.file(getAllPaymentDataFilePath(), {
    //   mode: 'attachment',
    //   filename: 'ffc-payment-data.csv'
    // })
  }
}
