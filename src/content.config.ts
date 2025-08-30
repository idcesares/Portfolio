import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/work" }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	blog: defineCollection({
		loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
};
