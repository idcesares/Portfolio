import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  site: 'https://dcesares.dev',
  integrations: [
    sitemap(),
    partytown({
			config: {
			  forward: ["dataLayer.push"],
			},
		}),
    mdx()
  ]
});