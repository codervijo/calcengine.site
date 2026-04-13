/**
 * Generates a sitemap.xml string from the calculator registry.
 * Run at build time via the Vite plugin in vite.config.ts.
 */

const BASE_URL = 'https://calcengine.dev';

export interface SitemapEntry {
  loc: string;
  changefreq?: string;
  priority?: number;
}

export function generateSitemapXml(calculatorSlugs: string[]): string {
  const staticPages: SitemapEntry[] = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/calculators', changefreq: 'weekly', priority: 0.9 },
  ];

  const calcPages: SitemapEntry[] = calculatorSlugs.map((slug) => ({
    loc: `/calculators/${slug}`,
    changefreq: 'monthly',
    priority: 0.8,
  }));

  const allPages = [...staticPages, ...calcPages];

  const urls = allPages
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq || 'monthly'}</changefreq>
    <priority>${p.priority ?? 0.5}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
