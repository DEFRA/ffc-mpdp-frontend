import { detailsModel } from '../../../../../app/routes/models/detailsModel';
import * as api from '../../../../../app/backend/api';
import { getSchemeStaticData } from '../../../../../app/utils/helper';

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
			payee_name: 'payee & name',
			payee_name2: 'payee & name Schneider',
			part_postcode: 'RG1',
			town: 'town',
			county_council: 'county_council',
			downloadLink: `/downloaddetails?payeeName=${encodeURIComponent('payee & name')}&partPostcode=RG1`,
			parliamentary_constituency: 'parliamentary_constituency',
			schemes: [
				{
					name: 'Farming Resilience Fund',
					detail: 'Livestock Handling and weighing equipment',
					amount: '4210.00',
					financial_year: '21/22',
				},
				{
					name: 'Sustainable Farming Incentive',
					detail: 'Low and no input Grassland',
					amount: '3761.00',
					financial_year: '21/22',
				},
				{
					name: 'Sustainable Farming Incentive',
					detail: 'Arable and Horticultural Land',
					amount: '3492.00',
					financial_year: '21/22',
				},
				{
					name: 'Farming Resilience Fund',
					detail: 'Livestock Handling and weighing equipment',
					amount: '4210.00',
					financial_year: '22/23',
				},
				{
					name: 'Sustainable Farming Incentive',
					detail: 'Arable and Horticultural Land',
					amount: '3492.00',
					financial_year: '22/23',
				},
				{
					name: 'Sustainable Farming Incentive',
					detail: 'Low and no input Grassland',
					amount: '3761.00',
					financial_year: '22/23',
				},
			],
		});
		const result = await detailsModel({
			payeeName: 'payee & name',
			partPostcode: 'RG1',
			searchString: 'test',
			page: 'test',
		});

		const fetfData = getSchemeStaticData('Farming Resilience Fund');
		const sfiData = getSchemeStaticData('Sustainable Farming Incentive');
		
		expect(result).toStrictEqual({
			summary: {
				payee_name: 'payee & name',
				part_postcode: 'RG1',
				town: 'town',
				county_council: 'county_council',
				parliamentary_constituency: 'parliamentary_constituency',
				downloadLink: "/downloaddetails?payeeName=payee%20%26%20name&partPostcode=RG1",
				total: '22,926.00',
				schemes: [
					{
						name: 'Farming Resilience Fund',
						description: fetfData?.description,
						link: fetfData?.link,
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
						name: 'Sustainable Farming Incentive',
						description: sfiData?.description,
						link: sfiData?.link,
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
			relatedContentData: [
        {
          id: "fflmLink",
          pages: [
            "service-start",
            "search",
            "details",
            "scheme-payments-by-year",
          ],
          text: "Funding for farmers, growers and land managers",
          url: "https://www.gov.uk/guidance/funding-for-farmers",
        },
			],
		});
	});
});
