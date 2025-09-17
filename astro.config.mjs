import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import react from "@astrojs/react";
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),

  build: {
    format: "file",
  },

  site: 'https://dcesares.dev',

  integrations: [sitemap(), partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), embeds(), mdx(), react()],

  markdown: {
    syntaxHighlight: false,
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
