import { defineConfig, svgoOptimizer } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import vercel from "@astrojs/vercel";
import node from '@astrojs/node';
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import { createCssVariablesTheme } from 'shiki';
import { remarkReadingTime } from './remark-reading-time.mjs';
import { rehypeMembraneCode } from './rehype-membrane-code.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

// Shiki emits CSS variables instead of colors; global.css maps them onto the
// Membrane --code-* tokens, so highlighting uses the gate-checked syntax colors.
const membraneCodeTheme = createCssVariablesTheme({
  name: 'membrane',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

// Keep the official library serving/build hooks, but start its browser runtime
// only when CookieConsent authorizes Analytics. No worker is needed beforehand.
function partytownAfterConsent() {
  const integration = partytown({ config: { forward: ['dataLayer.push'] } });
  const setup = integration.hooks['astro:config:setup'];
  integration.hooks['astro:config:setup'] = (options) => setup({
    ...options,
    injectScript(stage, code) {
      if (stage === 'head-inline') {
        options.injectScript(stage, `window.addEventListener('portfolio:analytics-consent', () => {${code}\n}, { once: true });`);
      } else {
        options.injectScript(stage, code);
      }
    },
  });
  return integration;
}

// Read `updatedDate` straight from content frontmatter so the sitemap can advertise
// per-page lastmod without depending on the astro:content virtual module at config time.
function readUpdatedDates(collection) {
  const dir = fileURLToPath(new URL(`./src/content/${collection}/`, import.meta.url));
  const dates = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = readFileSync(`${dir}${file}`, 'utf-8');
    const match = raw.match(/^updatedDate:\s*(.+)$/m);
    if (!match) continue;
    const id = file.replace(/\.mdx?$/, '');
    dates.set(id, new Date(match[1].trim()));
  }
  return dates;
}

const sitemapLastmod = new Map([
  ...[...readUpdatedDates('blog')].map(([id, date]) => [`/blog/${id}/`, date]),
  ...[...readUpdatedDates('work')].map(([id, date]) => [`/work/${id}/`, date]),
]);

// https://astro.build/config
const nodePreview = process.env.ASTRO_BUILD_TARGET === 'node';

export default defineConfig({
  outDir: nodePreview ? './dist-preview' : './dist',
  // Keep server output to preserve Vercel runtime image optimization and analytics integration.
  output: 'server',

  // Prefetch configuration for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Experimental features
  experimental: {
    // SVGO optimization for smaller SVG files
    svgOptimizer: svgoOptimizer({
      // Run optimization repeatedly until no further improvements are found
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
        },
      ],
    }),
  },

  adapter: nodePreview ? node({ mode: 'standalone' }) : vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: true,
  }),

  // Enable HTML compression for smaller payloads
  compressHTML: true,

  // Image optimization settings
  image: {
    // Default layout for responsive images
    layout: 'constrained',
    // Enable responsive styles for proper image resizing
    responsiveStyles: true,
    // Sharp codec-specific defaults for consistent image encoding
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4 },
        png: { compressionLevel: 9 },
      },
    },
    // Hosts the image optimizer may fetch. These are the remote covers in
    // content (YouTube thumbs, Spotify art, Senac PE, the Pantanal figure).
    // GitHub serves that figure from github.com, then redirects to
    // raw.githubusercontent.com, and Astro checks every hop. A protocol-only
    // pattern would allow any HTTPS host.
    domains: [
      'i.ytimg.com',
      'i3.ytimg.com',
      'img.youtube.com',
      'i.scdn.co',
      'github.com',
      'raw.githubusercontent.com',
      'www.pe.senac.br',
    ],
  },

  build: {
    format: nodePreview ? 'directory' : 'file',
  },

  // Enforce a single canonical URL shape (with trailing slash) so pages don't
  // exist at two indexable addresses; requests to the other form get a 308.
  trailingSlash: 'always',

  site: 'https://www.dcesares.dev',

  // Fonts are the Membrane's own self-hosted files (design-system/fonts), loaded
  // by membrane.css with metric-matched fallbacks; MainHead preloads the two
  // faces every page renders above the fold.

  integrations: [{
    // Dev-only workaround for an Astro 7 mismatch: with trailingSlash 'always'
    // the /_image endpoint only matches WITH a trailing slash, but generated
    // URLs omit it, so every dev image request 404s. Rewrite before routing.
    // Production is unaffected (Vercel's image service handles all images).
    name: 'image-endpoint-trailing-slash-fix',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.startsWith('/_image?')) {
            req.url = req.url.replace('/_image?', '/_image/?');
          }
          next();
        });
      },
    },
  }, sitemap({
    serialize(item) {
      const pathname = new URL(item.url).pathname;
      const lastmod = sitemapLastmod.get(pathname);
      return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
    },
  }), partytownAfterConsent(), mdx()],

  markdown: {
    syntaxHighlight: false,
    processor: unified({
      // SmartyPants configured for Brazilian Portuguese typography.
      smartypants: {
        openingQuotes: { double: '\u201C', single: '\u2018' },
        closingQuotes: { double: '\u201D', single: '\u2019' },
        dashes: true,
        ellipses: true,
      },
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: membraneCodeTheme,
            keepBackground: false,
          },
        ],
        rehypeMembraneCode,
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    // fuse.js is only imported dynamically (search); pre-bundle it so the dev
    // server doesn't discover it on first use and reload the page mid-session.
    optimizeDeps: {
      include: ['fuse.js'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('fuse.js')) {
              return 'search';
            }
          }
        }
      }
    }
  }
});
