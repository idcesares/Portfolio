import type { APIRoute } from 'astro';
import {
	CATEGORIES,
	CURATED_AT,
	KIND_NAME,
	SOURCES,
	type SignalCategoryId,
	type SignalSource,
} from '../data/tech-signal-sources';
import { buildOpml, type OpmlItem } from '../utils/opml';
import { AUTHOR_NAME } from '../utils/seo';

export const prerender = true;

/**
 * Só entram fontes com feed conferido por requisição real. Parte da
 * curadoria não publica RSS próprio e fica de fora: um OPML com endereço
 * chutado quebra em silêncio dentro do leitor de quem importou.
 */
const withFeed = SOURCES.filter(
	(source): source is SignalSource & { feed: string } => Boolean(source.feed)
);

/** A primeira categoria de cada fonte vira a pasta no leitor de feeds. */
const CATEGORY_LABEL = new Map<SignalCategoryId, string>(
	CATEGORIES.filter((category) => category.id !== 'todas').map((category) => [
		category.id as SignalCategoryId,
		category.label,
	])
);

const toItem = (source: SignalSource & { feed: string }): OpmlItem => ({
	name: source.name,
	xmlUrl: source.feed,
	htmlUrl: source.url,
	description: `${KIND_NAME[source.kind]} · ${source.cadence} · ${source.region}`,
});

export const GET: APIRoute = ({ site }) => {
	const baseUrl = site ?? new URL('https://dcesares.dev');
	const pageUrl = new URL('/tech-signal/', baseUrl).toString();

	const folders = [...CATEGORY_LABEL.keys()].map((id) => ({
		label: CATEGORY_LABEL.get(id) as string,
		items: withFeed
			.filter((source) => source.cats[0] === id)
			.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name, 'pt-BR'))
			.map(toItem),
	}));

	const body = buildOpml({
		title: 'Tech Signal Stack',
		ownerName: AUTHOR_NAME,
		ownerId: pageUrl,
		modified: new Date(`${CURATED_AT}T00:00:00Z`),
		folders,
	});

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/x-opml+xml; charset=utf-8',
			'Content-Disposition': 'attachment; filename="tech-signal-stack.opml"',
			'Cache-Control': 'public, max-age=3600, s-maxage=43200',
		},
	});
};
