/**
 * Geração de OPML 2.0. Usada pela rota /tech-signal.opml (lista inteira) e pelo
 * botão da página que baixa só o recorte filtrado, para as duas saídas terem
 * exatamente o mesmo formato.
 */

export interface OpmlItem {
	name: string;
	xmlUrl: string;
	htmlUrl: string;
	description: string;
}

export interface OpmlFolder {
	label: string;
	items: OpmlItem[];
}

export interface OpmlDocument {
	title: string;
	ownerName: string;
	ownerId: string;
	modified: Date;
	folders: OpmlFolder[];
}

export const escapeXml = (value: string) =>
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

const outline = (item: OpmlItem) => {
	const attrs: Array<[string, string]> = [
		['type', 'rss'],
		['text', item.name],
		['title', item.name],
		['xmlUrl', item.xmlUrl],
		['htmlUrl', item.htmlUrl],
		['description', item.description],
	];
	return `      <outline ${attrs.map(([key, value]) => `${key}="${escapeXml(value)}"`).join(' ')}/>`;
};

export function buildOpml(doc: OpmlDocument): string {
	const folders = doc.folders
		.filter((folder) => folder.items.length > 0)
		.map(
			(folder) => `    <outline text="${escapeXml(folder.label)}" title="${escapeXml(folder.label)}">
${folder.items.map(outline).join('\n')}
    </outline>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(doc.title)}</title>
    <ownerName>${escapeXml(doc.ownerName)}</ownerName>
    <ownerId>${escapeXml(doc.ownerId)}</ownerId>
    <dateModified>${doc.modified.toUTCString()}</dateModified>
  </head>
  <body>
${folders}
  </body>
</opml>
`;
}
