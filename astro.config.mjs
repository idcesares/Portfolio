import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import react from "@astrojs/react";
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import { remarkReadingTime } from './remark-reading-time.mjs';

import tailwindcss from '@tailwindcss/vite';

const copyIcon = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E2DCD2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="10" height="10" rx="2"/><path d="M6 14H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/></svg>'
)}`;
const successIcon = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7BC494" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
)}`;

// https://astro.build/config
export default defineConfig({
  // Keep server output to preserve Vercel runtime image optimization and analytics integration.
  output: 'server',

  // Prefetch configuration for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Experimental features for better performance
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
    // Queued rendering: two-pass approach for up to 2x faster rendering (planned default in v7)
    queuedRendering: {
      enabled: true,
      // Reuse rendered string values across content collection pages (blog/work)
      contentCache: true,
    },
  },

  adapter: vercel({
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
    // Sharp codec-specific defaults (Astro 6.1) for consistent image encoding
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4 },
        png: { compressionLevel: 9 },
      },
    },
    // Authorize remote image domains for optimization
    domains: [
      'i.ytimg.com',
      'i3.ytimg.com',
      'img.youtube.com',
      'i.scdn.co',
      'github.com',
      'raw.githubusercontent.com',
      'www.pe.senac.br',
    ],
    // Allow any HTTPS remote images as fallback
    remotePatterns: [{ protocol: 'https' }],
  },

  build: {
    format: "file",
  },

  // Ensure consistent URL format (no trailing slash matches build.format: "file")
  trailingSlash: 'ignore',

  site: 'https://www.dcesares.dev',

  // Built-in Fonts API (Astro 6) — self-hosted, optimized fallbacks, no external Google requests
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-serif',
      weights: ['300 900'],
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 600],
      styles: ['normal'],
      fallbacks: ['monospace'],
    },
  ],

  integrations: [sitemap(), partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), mdx(), react()],

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
            theme: 'github-dark-dimmed',
            keepBackground: false,
            wrap: true,
            transformers: [
              transformerCopyButton({
                visibility: 'hover',
                feedbackDuration: 2000,
                copyIcon,
                successIcon,
              }),
            ],
          },
        ],
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
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
