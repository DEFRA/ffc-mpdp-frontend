import wreck from '@hapi/wreck'
import config from '../config'
import dummyResults from './data/mockResults'

export const get = async (url: string) => wreck.get(`${config.backendEndpoint}${url}`)

export const search = (searchQuery: string, offset: number, limit: number = config.search.limit) => {
    const results = dummyResults.filter(x => x.payee_name.toLowerCase().includes(searchQuery.toLowerCase()))
    if(!results) {
        return {
            results: [],
            total: 0
        }
    }

    return { 
        results: results.slice(offset, offset + limit),
        total: results.length
    }
}