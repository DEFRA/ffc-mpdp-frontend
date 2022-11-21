import { schemeStaticData } from '../data/schemeStaticData'

export const getReadableAmount = (amount: number | undefined) => {
	if(typeof amount !== 'number') {
		return '0'
	}

	return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const getSchemeStaticData = (schemeName: string) => schemeStaticData.find(x => x.name === schemeName)
  