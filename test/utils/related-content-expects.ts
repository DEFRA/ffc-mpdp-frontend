import { CheerioAPI } from "cheerio"

const expectedList = [
	{
		id: '#fflmLink',
		text: 'Funding for farmers and land managers',
		href: 'https://www.gov.uk/guidance/funding-for-farmers#contents'
	},
	{
		id: '#sf1Link',
		text: 'Sustainable Farming Incentive pilot',
		href: 'https://defrafarming.blog.gov.uk/sustainable-farming-incentive-pilot/'
	},
	{
		id: '#fetfLink',
		text: 'Farming Equipment and Technology Fund',
		href: 'https://www.gov.uk/guidance/farming-investment-fund'
	},
	{
		id: '#thpLink',
		text: 'Tree Health Pilot Scheme',
		href: 'https://www.gov.uk/guidance/tree-health-pilot-scheme'
	}
]

export const expectRelatedContent = ($: CheerioAPI) => {
    expectedList.forEach((x) => {
        const linkElement = $(x.id)
        expect(linkElement).toBeDefined()
        expect(linkElement.attr('href')).toContain(x.href)
        expect(linkElement.text()).toMatch(x.text)
    })
}
