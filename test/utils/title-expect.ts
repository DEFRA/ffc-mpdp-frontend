import { CheerioAPI } from "cheerio"
import config from "../../app/config"
import { trimExtraSpaces } from "./helpers"

export const expectTitle = ($: CheerioAPI, pageTitle: string) => {
	const _pageTitle = pageTitle ? `${pageTitle} - ` : ''
	expect(trimExtraSpaces($('title').text())).toMatch(`${_pageTitle}${config.serviceName} - GOV.UK`)
}