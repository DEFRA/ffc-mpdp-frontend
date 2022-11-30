import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { get } from '../backend/api'

module.exports = {
  method: 'GET',
  path: '/backendHealthy',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const result: any = await get('/healthy')
    return h.response(result.res.statusMessage).code(200)
  }
}
