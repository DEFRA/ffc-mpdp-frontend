import { CheerioAPI } from 'cheerio';
import { getRelatedContentLinks } from '../../app/config/relatedContent';

export const expectRelatedContent = ($: CheerioAPI, page: string) => {
  const relatedContentLinks = getRelatedContentLinks(page);

  relatedContentLinks.forEach((x) => {
    const linkElement = $(`#${x.id}`);

    expect(linkElement).toBeDefined();
    expect(linkElement.attr('href')).toContain(x.url);
    expect(linkElement.text()).toMatch(x.text);
  });
};
