import wreck from '@hapi/wreck'
import config from '../config'
import { getUrlParams } from '../utils/helper'
import { Summary } from '../types'
import fetch from "node-fetch"

export const get = async (url: string) => { 
	try {
		return (await wreck.get(`${config.backendEndpoint}${url}`))
	}
	catch (err) {
		console.error(`Encountered error while calling the backend with url: ${config.backendEndpoint}${url}}`, err)
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

export const getPaymentData = async (searchString: string, offset: number, filterBy: any, sortBy : string, action?:string, limit: number = config.search.limit) => {
	const response: any = await post('/paymentdata', {
		searchString,
		limit,
		offset,
		filterBy,
		sortBy,
		action
	})

	if(!response) {
		return { results: [], total: 0, filterOptions: {} }
	}

	const result = JSON.parse(response.payload)
	return {
		results: result.rows,
		total: result.count,
		filterOptions: result.filterOptions
	}
}

export const getSearchSuggestions = async (searchString: string) => {
	const url = getUrlParams('searchsuggestion', {
		searchString
	})

	const response: any = await get(url)
	if(!response) {
		return { rows: [], count: 0 };
	}

	return JSON.parse(response.payload)
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

export const getDownloadDetailsCsv = async (payeeName: string, partPostcode: string): Promise<Buffer> => {
	const url = getUrlParams('downloaddetails', {
		payeeName,
		partPostcode
	})
	return getBufferFromUrl(url)
}

const getBufferFromUrl = async (url:string): Promise<Buffer> => {
	try {
		const response = await fetch(`${config.backendEndpoint}${url}`)
		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.log("Error while reading from URL " + url , error)
		throw error
	}
}