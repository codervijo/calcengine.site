import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      // Read calculator slugs from the registry source
      const registryPath = path.resolve(__dirname, 'src/calculators/registry/index.ts');
      const content = fs.readFileSync(registryPath, 'utf-8');
      const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];

      // Fallback: read from definition files
      let slugs: string[] = slugMatches.map(m => m[1]);
      if (slugs.length === 0) {
        const defsDir = path.resolve(__dirname, 'src/calculators/definitions');
        if (fs.existsSync(defsDir)) {
          const files = fs.readdirSync(defsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
          for (const file of files) {
            const defContent = fs.readFileSync(path.join(defsDir, file), 'utf-8');
            const m = defContent.match(/slug:\s*['"]([^'"]+)['"]/);
            if (m) slugs.push(m[1]);
          }
        }
      }

      const BASE_URL = 'https://calcengine.dev';
      const staticPages = [
        { loc: '/', changefreq: 'weekly', priority: '1.0' },
        { loc: '/calculators', changefreq: 'weekly', priority: '0.9' },
      ];
      const calcPages = slugs.map(s => ({ loc: `/calculators/${s}`, changefreq: 'monthly', priority: '0.8' }));
      const allPages = [...staticPages, ...calcPages];

      const urls = allPages.map(p =>
        `  <url>\n    <loc>${BASE_URL}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      ).join('\n');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
        console.log(`✓ sitemap.xml generated with ${allPages.length} URLs`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), sitemapPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));