const BASE_URL = 'https://calcengine.site';

const ORG = {
  '@type': 'Organization',
  name: 'CalcEngine',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/og/home.png`,
    width: 1200,
    height: 630,
  },
} as const;

const ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&amp;': '&', // last, so "&amp;lt;" decodes to "&lt;", not "<"
};

/**
 * FAQ answers are authored as HTML (links, <code>) for the visible page.
 * Schema answer text must be the same words without markup: Google only
 * allows a few tags there (<code> isn't one), and the answer must match
 * what's visible on the page.
 */
export function htmlToPlainText(html: string): string {
  let text = html.replace(/<[^>]*>/g, '');
  for (const [entity, char] of Object.entries(ENTITIES)) {
    text = text.split(entity).join(char);
  }
  return text.replace(/\s+/g, ' ').trim();
}

export function buildFaqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: htmlToPlainText(item.answer) },
    })),
  };
}

export function buildWebAppJsonLd(
  name: string,
  description: string,
  url: string,
  ogImageUrl?: string,
  dateModified?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    ...(ogImageUrl ? { image: ogImageUrl } : {}),
    ...(dateModified ? { dateModified } : {}),
    inLanguage: 'en-US',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    creator: ORG,
    publisher: ORG,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CalcEngine',
    url: BASE_URL,
    description: 'Free online calculators with open formulas: business and seller fees, math, electrical and energy, and developer tools.',
    inLanguage: 'en-US',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    sameAs: [
      'https://github.com/codervijo/calcengine.site',
    ],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalcEngine',
    url: BASE_URL,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/calculators?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
