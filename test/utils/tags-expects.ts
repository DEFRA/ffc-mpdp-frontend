import { CheerioAPI } from "cheerio"

export const expectTags = ($: CheerioAPI, filters: string[]) => {
    const tags = $('button.mpdp-button').map((_i, x) => $(x).text()).toArray()
    expect(tags.length).toBe(filters.length)
    expect(filters.every((x, i) => tags.find(y => y.includes(x)))).toBe(true)
}
