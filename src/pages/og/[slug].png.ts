import type { APIRoute } from 'astro';
import { getAllCalculators } from '../../calculators/registry';
import { CATEGORY_LABELS } from '../../calculators/registry/types';
import { calcOgTemplate } from '../../og/OgTemplate';
import { renderOgImage } from '../../og/renderOg';

export function getStaticPaths() {
  return getAllCalculators().map((c) => ({
    params: { slug: c.meta.slug },
    props: { meta: c.meta },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { meta } = props;
  const png = await renderOgImage(
    calcOgTemplate({
      title: meta.title,
      description: meta.description,
      category: CATEGORY_LABELS[meta.category],
    }),
  );
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
