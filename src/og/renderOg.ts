import type { ReactNode } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

let fontCache: ArrayBuffer | null = null;

async function loadInterBold(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;

  // Request TTF format by sending a legacy User-Agent — modern UAs get WOFF2 which satori can't parse
  const css = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@700', {
    headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)' },
  }).then((r) => r.text());

  const match = css.match(/src: url\((.+?)\) format\('truetype'\)/);
  if (!match) {
    throw new Error(
      'Could not find TTF font URL from Google Fonts. Check network access at build time.',
    );
  }

  fontCache = await fetch(match[1]).then((r) => r.arrayBuffer());
  return fontCache;
}

export async function renderOgImage(element: ReactNode): Promise<Uint8Array> {
  const fontData = await loadInterBold();

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }],
  });

  return new Resvg(svg).render().asPng();
}
