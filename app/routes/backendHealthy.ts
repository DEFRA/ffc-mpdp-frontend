import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { get } from '../backend/api'

module.exports = {
  method: 'GET',
  path: '/backendHealthy',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const { res } = await get('/healthy')
    return h.response(`Response from backend: ${JSON.stringify(Object.keys(res))}`).code(200)
  }
}
