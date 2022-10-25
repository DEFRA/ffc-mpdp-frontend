import * as wreck from '@hapi/wreck'
import config from '../config'

export const get = async (url: string) => wreck.get(`${config.backendEndpoint}${url}`)
