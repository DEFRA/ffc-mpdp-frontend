import { CheerioAPI } from "cheerio"

export const expectTags = ($: CheerioAPI, filters: string[]) => {
    const tags = $('button.mpdp-button').map((_i, x) => $(x).text())
    expect(tags.length).toBe(filters.length)
    
    expect(filters.every((x, i) => {
        console.log('x is: ' + x)
        console.log(tags[i])
        return tags[i].includes(x)
    })).toBe(true)
}
