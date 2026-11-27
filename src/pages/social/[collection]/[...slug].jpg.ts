import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { getArticleSocialImage, renderArticleSocialImage, type ShareableEntry } from '../../../utils/social-image';

export const prerender = true;

export const getStaticPaths = (async () => {
	const [posts, works] = await Promise.all([
		getCollection('blog', ({ data }) => !data.draft),
		getCollection('work', ({ data }) => !data.draft),
	]);
	const entries = [...posts, ...works];
	const covers = await Promise.all(entries.map(getArticleSocialImage));
	return entries.filter((_, index) => covers[index]).map((entry) => ({
		params: { collection: entry.collection, slug: entry.id },
		props: { entry },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: ShareableEntry }> = async ({ props }) => {
	const cover = await renderArticleSocialImage(props.entry);
	if (!cover) return new Response(null, { status: 404 });
	return new Response(new Uint8Array(cover), { headers: { 'Content-Type': 'image/jpeg' } });
};
