import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { get } from '../backend/api'

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const { res } = await get('/downloadall')
    return h.response(res).code(200)
  }
}