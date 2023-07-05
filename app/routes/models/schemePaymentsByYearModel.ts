import { getSchemePaymentsByYear } from '../../backend/api';
import { AggragateSchemeData, AggragateSchemeDetail } from '../../types';
import { getFinancialYearSummary, getReadableAmount } from '../../utils/helper';

type SchemePayments = { 
	name: string, 
	total: number, 
	readableTotal: string 
}

type YearlyPayments = { 
	[year: string]: { 
		total: number,
		readableTotal?: string
	} 
}

export const schemePaymentsByYearModel = async () => {
	const schemePaymentsByYear = await getSchemePaymentsByYear();

	if (!schemePaymentsByYear) {
		throw new Error();
	}

	const returnVal = {
		summary: {
			...getFinancialYearSummary(Object.keys(schemePaymentsByYear)),
			...getSchemeSummary(schemePaymentsByYear),
			schemePaymentsByYear: transformSummary(schemePaymentsByYear)
		},
	};

	return returnVal
};

const getSchemeSummary = (schemePaymentsByYear: AggragateSchemeData) => {
	let total = 0;
	const totalPaymentsBySchemes: SchemePayments[] = []
	const totalPaymentsByYear: YearlyPayments = {}

	Object.keys(schemePaymentsByYear).forEach(year => {
		const formattedYear = getFormattedYear(year)
		totalPaymentsByYear[formattedYear] = { total: 0 }

		schemePaymentsByYear[year].forEach(({ scheme, total_amount }: AggragateSchemeDetail) => {
			const schemeData = totalPaymentsBySchemes.find(x => x?.name === scheme)
			const schemeAmount = parseInt(total_amount)

			if(!schemeData) {
				totalPaymentsBySchemes.push({
					name: scheme,
					total: schemeAmount,
					readableTotal: getReadableAmount(schemeAmount),
				})
			}
			else {
				schemeData.total += schemeAmount
				schemeData.readableTotal = getReadableAmount(schemeData.total)
			}

			total += schemeAmount
			totalPaymentsByYear[formattedYear].total += schemeAmount
		})

		totalPaymentsByYear[formattedYear].readableTotal = getReadableAmount(totalPaymentsByYear[formattedYear].total)
	})

	return {
		totalPaymentsBySchemes,
		totalPaymentsByYear,
		readableTotalAmount: getReadableAmount(total)
	}
};

const getFormattedYear = (year: string) => {
	return year.split('/').map(x => `20${x}`).join(' to ');
}

const transformSummary = (schemePaymentsByYear: AggragateSchemeData) => {
	const schemePaymentsSummary: AggragateSchemeData = {}
	Object.keys(schemePaymentsByYear).forEach(year => {
		const formattedYear = getFormattedYear(year);
		schemePaymentsSummary[formattedYear] = schemePaymentsByYear[year].map(scheme => ({
			...scheme, total_amount: getReadableAmount(parseInt(scheme.total_amount))
		}))
	})
	return schemePaymentsSummary
}