import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const entrySchema = z
	.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()),
		img: z.string(),
		img_alt: z.string().optional(),
		draft: z.boolean().default(false),
	})
	.transform((data) => ({
		...data,
		updatedDate: data.updatedDate ?? data.publishDate,
	}));

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/work" }),
		schema: entrySchema,
	}),
	blog: defineCollection({
		loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
		schema: entrySchema,
	}),
};
