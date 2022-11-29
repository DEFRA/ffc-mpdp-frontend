import wreck from '@hapi/wreck'
import config from '../config'
import devData from './data/devData'
import { getUrlParams } from '../utils/helper'

export const get = async (url: string) => { 
	try {
		return (await wreck.get(`${config.backendEndpoint}${url}`))
	}
	catch (err) {
		console.error(`failed to get payment data for request ${url}`, err)
		return null
	}
}

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

export const getPaymentDetails = (payee_name: string) => {
	return devData.find(x => x.payee_name.toLowerCase().includes(payee_name.toLowerCase()))
}
