import { Request, ResponseToolkit } from '@hapi/hapi';
import { get } from '../backend/api';

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request: Request, _response: ResponseToolkit) => {
    try {
      const content: any = await get('/downloadPaymentsByYearSummary');
      return _response
        .response(content?.payload)
        .type('application/csv')
        .header(
          'Content-Disposition',
          'attachment; filename="ffc-payments-by-year.csv"'
        );
    } catch (error) {
      return _response.response(error as Error).code(500);
    }
  },
};