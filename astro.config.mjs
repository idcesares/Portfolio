import { defineConfig } from 'astro/config';
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
      plugins: [
        'preset-default',
        {
          name: 'removeViewBox',
          active: false // Preserve viewBox for scaling
        }
      ]
    }
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
  trailingSlash: 'never',

  site: 'https://dcesares.dev',

  integrations: [sitemap(), partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), embeds(), mdx(), react()],

  markdown: {
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
          manualChunks: {
            'search': ['fuse.js']
          }
        }
      }
    }
  }
});
