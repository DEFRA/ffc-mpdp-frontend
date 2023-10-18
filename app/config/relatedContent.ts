type relatedContent = {
  id: string;
  text: string;
  url: string;
  pages: string[];
}[];

export const relatedContentLinks = [
  {
    id: 'fflmLink',
    text: 'Funding for farmers, growers and land managers',
    url: 'https://www.gov.uk/guidance/funding-for-farmers',
    pages: ['service-start', 'search', 'details', 'scheme-payments-by-year'],
  },
  {
    id: 'ffCLink',
    text: 'Cookies',
    url: 'https://www.gov.uk/help/cookies',
    pages: ['privacy-policy'],
  },
  {
    id: 'ffTCLink',
    text: 'Terms and conditions',
    url: 'https://www.gov.uk/help/terms-conditions',
    pages: ['privacy-policy'],
  },
];

export const getRelatedContentLinks = (page: string): relatedContent => {
  return relatedContentLinks.filter((relatedContent) =>
    relatedContent.pages.includes(page)
  );
};
