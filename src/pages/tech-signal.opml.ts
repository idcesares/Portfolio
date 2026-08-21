import type { APIRoute } from 'astro';
import {
	CATEGORIES,
	CURATED_AT,
	KIND_NAME,
	SOURCES,
	type SignalCategoryId,
	type SignalSource,
} from '../data/tech-signal-sources';
import { AUTHOR_NAME } from '../utils/seo';

export const prerender = true;

const escapeXml = (value: string) =>
	value.replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			default:
				return '&apos;';
		}
	});

/**
 * Só entram fontes com feed conferido por requisição real. Dez fontes da
 * curadoria não publicam RSS próprio e ficam de fora: um OPML com endereço
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

const outline = (source: SignalSource & { feed: string }) => {
	const attrs = [
		['type', 'rss'],
		['text', source.name],
		['title', source.name],
		['xmlUrl', source.feed],
		['htmlUrl', source.url],
		['description', `${KIND_NAME[source.kind]} · ${source.cadence} · ${source.region}`],
	];
	return `      <outline ${attrs
		.map(([key, value]) => `${key}="${escapeXml(value)}"`)
		.join(' ')}/>`;
};

export const GET: APIRoute = ({ site }) => {
	const baseUrl = site ?? new URL('https://dcesares.dev');
	const pageUrl = new URL('/tech-signal/', baseUrl).toString();

	const groups = [...CATEGORY_LABEL.keys()]
		.map((id) => ({
			label: CATEGORY_LABEL.get(id) as string,
			items: withFeed
				.filter((source) => source.cats[0] === id)
				.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name, 'pt-BR')),
		}))
		.filter((group) => group.items.length > 0);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Tech Signal Stack</title>
    <ownerName>${escapeXml(AUTHOR_NAME)}</ownerName>
    <ownerId>${escapeXml(pageUrl)}</ownerId>
    <dateModified>${new Date(`${CURATED_AT}T00:00:00Z`).toUTCString()}</dateModified>
  </head>
  <body>
${groups
	.map(
		(group) => `    <outline text="${escapeXml(group.label)}" title="${escapeXml(group.label)}">
${group.items.map(outline).join('\n')}
    </outline>`
	)
	.join('\n')}
  </body>
</opml>
`;

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/x-opml+xml; charset=utf-8',
			'Content-Disposition': 'attachment; filename="tech-signal-stack.opml"',
			'Cache-Control': 'public, max-age=3600, s-maxage=43200',
		},
	});
};
