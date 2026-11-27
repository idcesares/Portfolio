import { getEntries, type CollectionEntry } from 'astro:content';

export async function getThemeWork(theme: CollectionEntry<'themes'>) {
	return (await getEntries(theme.data.work)).filter((entry) => entry && !entry.data.draft);
}

export function getThemeCover(work: CollectionEntry<'work'>[]) {
	for (const entry of work) {
		const { data } = entry;
		if (typeof data.img !== 'string') {
			return { entry, src: data.img, alt: data.img_alt ?? '' };
		}
	}
}
