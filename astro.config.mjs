import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import embeds from 'astro-embed/integration';
import react from "@astrojs/react";

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
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});