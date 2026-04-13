import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = 'https://calcengine.dev';

export default function SEOHead({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary',
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    if (keywords?.length) setMeta('keywords', keywords.join(', '));

    // Open Graph
    setMeta('og:title', ogTitle || title, 'property');
    setMeta('og:description', ogDescription || description, 'property');
    setMeta('og:type', ogType, 'property');
    const canonicalUrl = canonical
      ? canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`
      : BASE_URL;
    setMeta('og:url', canonicalUrl, 'property');
    if (ogImage) setMeta('og:image', ogImage, 'property');
    setMeta('og:site_name', 'CalcEngine', 'property');

    // Twitter Card
    setMeta('twitter:card', twitterCard);
    setMeta('twitter:title', ogTitle || title);
    setMeta('twitter:description', ogDescription || description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    // JSON-LD
    const jsonLdId = 'seo-jsonld';
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = jsonLdId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
    } else if (script) {
      script.remove();
    }

    return () => {
      document.title = 'CalcEngine';
      const existingScript = document.getElementById(jsonLdId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogType, ogImage, twitterCard, jsonLd]);

  return null;
}

/** Build FAQPage JSON-LD from FAQ items */
export function buildFaqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Build WebApplication JSON-LD for a calculator */
export function buildWebAppJsonLd(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/** Build BreadcrumbList JSON-LD */
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
