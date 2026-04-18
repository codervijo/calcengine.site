import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.calcengine.site',
  trailingSlash: 'never',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
});
