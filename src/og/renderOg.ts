import type { ReactNode } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

let fontCache: ArrayBuffer | null = null;

async function loadInterBold(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  // process.cwd() is the project root during `astro build` locally and on Vercel.
  // The font lives in src/ and is not bundled — read it directly from source.
  const fontPath = resolve(process.cwd(), 'src/assets/fonts/inter-bold.ttf');
  const buf = await readFile(fontPath);
  // Slice to get a clean ArrayBuffer (Node Buffer shares its underlying memory)
  fontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
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
