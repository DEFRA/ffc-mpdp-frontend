import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import config from '../config';
import * as utils from '../utils';

const urlcsv = `${config.backendEndpoint}` + '/downloadPaymentsByYearSummary';

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request: Request, _response: ResponseToolkit) => {
    try {
      const content = await utils.getBuffer(urlcsv);
      return _response
        .response(content)
        .type('application/csv')
        .header(
          'Content-Disposition',
          'attachment; filename="ffc-year-payments-summary.csv"'
        );
    } catch (error) {
      return _response.response(error as Error).code(500);
    }
  },
};