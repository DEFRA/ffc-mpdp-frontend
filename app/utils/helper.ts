import config from '../config';
import { schemeStaticData } from '../data/schemeStaticData'

export const getReadableAmount = (amount: number | undefined) => {
	if(typeof amount !== 'number') {
		return '0'
	}

	return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const getSchemeStaticData = (schemeName: string) => schemeStaticData.find(x => x.name === schemeName)

export const getUrlParams = (page: string, params: any = {}) => `/${page}?${new URLSearchParams(params).toString()}`

export const getPageTitle = (route: string) => config.routes[route]?.title || ''

export const removeTrailingSlash = (url: string) => url.replace(/\/$/, "")