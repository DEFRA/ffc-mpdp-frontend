const { getRelatedContentLinks } = require('../../app/config/related-content')

const expectRelatedContent = ($, page) => {
  const relatedContentLinks = getRelatedContentLinks(page)

  relatedContentLinks.forEach((x) => {
    const linkElement = $(`#${x.id}`)

    expect(linkElement).toBeDefined()
    expect(linkElement.attr('href')).toContain(x.url)
    expect(linkElement.text()).toMatch(x.text)
  })
}

module.exports = {
  expectRelatedContent
}
