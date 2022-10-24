import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { get } from '../backend/api'

module.exports = {
  method: 'GET',
  path: '/backendHealthy',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const { res } = await get('/healthy')
    return h.response(`Response from backend: ${res.statusMessage}`).code(200)
  }
}
