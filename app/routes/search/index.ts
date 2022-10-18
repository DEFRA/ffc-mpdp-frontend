import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import Joi from "joi";

module.exports = [
    {
        path: '/search',
        method: 'GET',
        options: {
            auth: false,
            handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
                return h.view('search/index')
            }
        }
    },
    {
        path: '/search',
        method: 'POST',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    searchString: Joi.string()
                }),
                failAction: async (request: Request, h: ResponseToolkit, error: any) => {
                    return h.view('search/index', { ...(request.payload as Object), errorMessage: { text: error.details[0].message } }).code(400).takeover()
                }
            },
            handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
                return h.view('search/index')
            }
        }
    }
]
