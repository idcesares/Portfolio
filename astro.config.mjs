import { defineConfig, fontProviders } from 'astro/config';
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import react from "@astrojs/react";
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import { remarkReadingTime } from './remark-reading-time.mjs';

import tailwindcss from '@tailwindcss/vite';

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
    svgo: {
      // Run optimization repeatedly until no further improvements are found
      multipass: true,
      plugins: [
        'preset-default',
        {
          name: 'removeViewBox',
          active: false // Preserve viewBox for scaling
        }
      ]
    },
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
  }), embeds(), mdx(), react()],

  markdown: {
    // SmartyPants configured for Brazilian Portuguese typography (Astro 6.1)
    smartypants: {
      openingQuotes: { double: '\u201C', single: '\u2018' },
      closingQuotes: { double: '\u201D', single: '\u2019' },
      dashes: true,
      ellipses: true,
    },
    syntaxHighlight: false,
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'dracula',
          keepBackground: true,
          wrap: true,
          transformers: [
            transformerCopyButton({
              visibility: 'hover',
              feedbackDuration: 2000,
            }),
          ],
        },
      ],
    ],
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
