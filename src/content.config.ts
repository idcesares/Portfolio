import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

// Covers are local (go through the image() helper for Sharp optimization —
// srcset, AVIF/WebP, no CLS) or remote URLs (YouTube thumbnails, Spotify,
// GitHub-hosted screenshots) that stay as plain strings.
const entrySchema = ({ image }: SchemaContext) =>
	z
		.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()),
			img: z.union([image(), z.url()]),
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
