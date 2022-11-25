import wreck from '@hapi/wreck'
import config from '../config'
import dummyResults from './data/mockResults'
import devData from './data/devData'

export const get = async (url: string) => wreck.get(`${config.backendEndpoint}${url}`)

const includes = (baseString: string, searchingString: string) => baseString.toLowerCase().includes(searchingString.toLowerCase())

export const search = (searchQuery: string, offset: number, limit: number = config.search.limit) => {
    const results = dummyResults.filter(x =>
        includes(x.payee_name, searchQuery) ||
        includes(x.town, searchQuery) ||
        includes(x.county_council, searchQuery) ||
        includes(x.part_postcode, searchQuery)
    )

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

export const getPaymentDetails = (payee_name: string) => {
    return devData.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))
}
