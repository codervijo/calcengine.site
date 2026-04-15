const BASE_URL = 'https://www.calcengine.site';

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

export function buildFaqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function buildWebAppJsonLd(name: string, description: string, url: string, ogImageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    ...(ogImageUrl ? { image: ogImageUrl } : {}),
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
    description: 'Free engineering calculators for developers.',
    inLanguage: 'en-US',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
  };
}
