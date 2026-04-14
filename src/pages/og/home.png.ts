import type { APIRoute } from 'astro';
import { calcOgTemplate } from '../../og/OgTemplate';
import { renderOgImage } from '../../og/renderOg';

export const GET: APIRoute = async () => {
  const png = await renderOgImage(
    calcOgTemplate({
      title: 'Engineering Calculators for Real Systems',
      description: 'Free tools for API costs, backend performance, and developer workflows.',
    }),
  );
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
