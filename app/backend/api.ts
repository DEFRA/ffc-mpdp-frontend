import wreck from '@hapi/wreck'
import config from '../config'
import { getUrlParams } from '../utils/helper'
import { Summary } from '../types'

export const get = async (url: string) => { 
	try {
		return (await wreck.get(`${config.backendEndpoint}${url}`))
	}
	catch (err) {
		console.error(`Encountered error while calling the backend with url: ${url}`, err)
		return null
	}
}

export const post = async (url: string, payload: any) => { 
	try {
		return (await wreck.post(`${config.backendEndpoint}${url}`, { payload }))
	}
	catch (err) {
		console.error(`Encountered error while calling the backend with url: ${url}`, err)
		return null
	}
}

export const getPaymentData = async (searchString: string, offset: number, filterBy: any, limit: number = config.search.limit) => {
	const response: any = await post('/paymentdata', {
		searchString,
		limit,
		offset,
		filterBy
	})

	if(!response) {
		return { results: [], total: 0 }
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
