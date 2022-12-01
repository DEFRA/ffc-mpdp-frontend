import wreck from '@hapi/wreck'
import config from '../config'
import { getUrlParams } from '../utils/helper'
import { Summary } from '../types'

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

export const getPaymentDetails = async (payeeName: string, partPostcode: string): Promise<Summary | null> => {
	const url = getUrlParams('paymentdetails', {
		payeeName,
		partPostcode
	})

	const response: any = await get(url)
	if(!response) {
		return null;
	}

	return JSON.parse(response.payload)
}
