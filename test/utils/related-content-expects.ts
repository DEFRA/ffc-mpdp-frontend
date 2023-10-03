import { CheerioAPI } from "cheerio"

const expectedList = [
	{
		id: '#fflmLink',
		text: 'Funding for farmers, growers and land managers',
		href: 'https://www.gov.uk/guidance/funding-for-farmers'
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
