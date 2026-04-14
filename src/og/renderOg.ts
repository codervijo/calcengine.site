import type { ReactNode } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';

let fontCache: ArrayBuffer | null = null;

async function loadInterBold(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const url = new URL('../assets/fonts/inter-bold.woff2', import.meta.url);
  fontCache = await readFile(url);
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
