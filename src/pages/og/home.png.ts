import type { APIRoute } from 'astro';
import { calcOgTemplate } from '../../og/OgTemplate';
import { renderOgImage } from '../../og/renderOg';

export const GET: APIRoute = async () => {
  const png = await renderOgImage(
    calcOgTemplate({
      title: 'Free Calculators With Open Formulas',
      description: 'Fees, pricing, math, electrical and developer calculators — formulas, assumptions and sources shown.',
    }),
  );
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
