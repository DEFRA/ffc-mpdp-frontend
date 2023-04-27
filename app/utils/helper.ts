import config from '../config';
import { schemeStaticData } from '../data/schemeStaticData'
import { amounts as staticAmounts } from '../data/filters/amounts'

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

export const getUrlParams = (page: string, params: any = {}) => `/${page}?${new URLSearchParams(params).toString()}`

export const getPageTitle = (route: string) => config.routes[route]?.title || ''

export const removeTrailingSlash = (url: string) => url.replace(/\/$/, "")

export const getMatchingStaticAmounts = (amounts: string[]) => {
	if(!amounts || !amounts.length) {
	  return []
	}
  
	const _amounts = amounts?.map(x => parseFloat(x))
  
	const returnAmounts = staticAmounts.filter(range => {
	  const [from, to] = range.value.split('-')
	  return _amounts?.some(amount => {
		if(!to) {
		  return amount > parseFloat(from);
		}
  
		return amount >= parseFloat(from) && amount <= parseFloat(to)
	  })
	})
  
	return returnAmounts
  }