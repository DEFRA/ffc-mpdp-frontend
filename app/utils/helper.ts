import config from '../config';
import { schemeStaticData } from '../data/schemeStaticData'
import { amounts } from '../data/filters/amounts'

export const getReadableAmount = (amount: number | undefined) => {
	if(typeof amount !== 'number') {
		return '0'
	}

	return amount.toLocaleString('en-GB', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

export const getSchemeStaticData = (schemeName: string) => schemeStaticData.find(x => x.name.toLowerCase() === schemeName.toLowerCase())

export const getAllSchemesNames = () => schemeStaticData.map(x => x.name)

export const getAllAmountFilters = () => amounts

export const getUrlParams = (page: string, params: any = {}) => `/${page}?${new URLSearchParams(params).toString()}`

export const getPageTitle = (route: string) => config.routes[route]?.title || ''

export const removeTrailingSlash = (url: string) => url.replace(/\/$/, "")