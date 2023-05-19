import { detailsModel } from '../../../../../app/routes/models/detailsModel';
import * as api from '../../../../../app/backend/api';

describe('detailsModel', () => {
	test('detailsModel returns empty object if getPaymentDetails returns null', async () => {
		jest.spyOn(api, 'getPaymentDetails').mockResolvedValue(null);
		const result = await detailsModel({
			payeeName: 'payee_name',
			partPostcode: 'post_code',
			searchString: 'test',
			page: '1',
		});
		expect(result).toStrictEqual({ searchString: 'test', page: '1' });
	});

	test('detailsModel returns summary if getPaymentDetails returns data', async () => {
		jest.spyOn(api, 'getPaymentDetails').mockResolvedValue({
			payee_name: 'payee_name',
			payee_name2: 'payee_name Schneider',
			part_postcode: 'RG1',
			town: 'town',
			county_council: 'county_council',
			parliamentary_constituency: 'parliamentary_constituency',
			schemes: [
				{
					name: 'Farming Equipment and Technology Fund',
					scheme_detail: 'Livestock Handling and weighing equipment',
					amount: '4210.00',
					financial_year: '21/22',
				},
				{
					name: 'Sustainable Farming Incentive Pilot',
					scheme_detail: 'Low and no input Grassland',
					amount: '3761.00',
					financial_year: '21/22',
				},
				{
					name: 'Sustainable Farming Incentive pilot',
					scheme_detail: 'Arable and Horticultural Land',
					amount: '3492.00',
					financial_year: '21/22',
				},
				{
					name: 'Farming Equipment and Technology Fund',
					scheme_detail: 'Livestock Handling and weighing equipment',
					amount: '4210.00',
					financial_year: '22/23',
				},
				{
					name: 'Sustainable Farming Incentive Pilot',
					scheme_detail: 'Arable and Horticultural Land',
					amount: '3492.00',
					financial_year: '22/23',
				},
				{
					name: 'Sustainable Farming Incentive Pilot',
					scheme_detail: 'Low and no input Grassland',
					amount: '3761.00',
					financial_year: '22/23',
				},
			],
		});
		const result = await detailsModel({
			payeeName: 'payee_name',
			partPostcode: 'RG1',
			searchString: 'test',
			page: 'test',
		});
		
		expect(result).toStrictEqual({
			summary: {
				payee_name: 'payee_name',
				part_postcode: 'RG1',
				town: 'town',
				county_council: 'county_council',
				parliamentary_constituency: 'parliamentary_constituency',
				total: '22,926.00',
				schemes: [
					{
						name: 'Farming Equipment and Technology Fund',
						description:
							'Grants to help farmers, horticulturalists and forestry owners invest in new technology.',
						link: 'https://www.gov.uk/guidance/farming-equipment-and-technology-fund-round-1-manual',
						total: 8420,
						readableTotal: '8,420.00',
						activity: {
							'2021 to 2022': {
								total: 4210,
								readableTotal: '4,210.00',
								schemeDetails: [
									{
										name: 'Livestock Handling and weighing equipment',
										amount: '4,210.00',
									},
								],
							},
							'2022 to 2023': {
								total: 4210,
								readableTotal: '4,210.00',
								schemeDetails: [
									{
										name: 'Livestock Handling and weighing equipment',
										amount: '4,210.00',
									},
								],
							},
						},
					},
					{
						name: 'Sustainable Farming Incentive Pilot',
						description:
							'Funding for farmers to manage their land in an environmentally sustainable way.',
						link: 'https://www.gov.uk/government/collections/sustainable-farming-incentive-guidance',
						total: 14506,
						readableTotal: '14,506.00',
						activity: {
							'2021 to 2022': {
								total: 7253,
								readableTotal: '7,253.00',
								schemeDetails: [
									{
										name: 'Low and no input Grassland',
										amount: '3,761.00',
									},
									{
										name: 'Arable and Horticultural Land',
										amount: '3,492.00',
									},
								],
							},
							'2022 to 2023': {
								total: 7253,
								readableTotal: '7,253.00',
								schemeDetails: [
									{
										name: 'Arable and Horticultural Land',
										amount: '3,492.00',
									},
									{
										name: 'Low and no input Grassland',
										amount: '3,761.00',
									},
								],
							},
						},
					},
				],
				financial_years: ['21/22', '22/23'],
				startYear: '2021',
				endYear: '2023',
			},
			searchString: 'test',
			page: 'test',
		});
	});
});