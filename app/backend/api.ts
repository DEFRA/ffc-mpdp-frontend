import wreck from '@hapi/wreck'
import config from '../config'
import dummyResults from './data/mockResults'
import devData from './data/devData'
import { getUrlParams } from '../utils/helper'

export const get = async (url: string) => { 
	try {
		return wreck.get(`${config.backendEndpoint}${url}`) 
	}
	catch (err) {
		console.error(`failed to get payment data for request ${url}`, err)
		return null
	}
}

const includes = (baseString: string, searchingString: string) => baseString.toLowerCase().includes(searchingString.toLowerCase())

export const getPaymentData = async (searchString: string, offset: number, limit: number = config.search.limit) => {
	const url = getUrlParams('paymentdata', {
		searchString,
		limit,
		offset
	})

	const response: any = await get(url)
	if(!response) {
		return {
			results: [],
			total: 0
		}
	}

	const result = JSON.parse(response.payload)
	return {
		results: result.rows,
		total: result.count
	}
}

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
